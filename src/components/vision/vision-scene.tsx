"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GRID_COUNT, GRID_SIDE, makeTopology, gridPhases, writeGrid, type GridForm } from "./vision-geometry";

export type VisionInput = {
  progress: number;
  form: GridForm;
  yaw: number;
  pitch: number;
  pulse: number;
  dark: boolean;
};

export default function VisionScene({ input, onStatus, label }: {
  input: MutableRefObject<VisionInput>;
  onStatus: (status: "ready" | "unavailable") => void;
  label: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      onStatus("unavailable");
      return;
    }
    const canvas = renderer.domElement;
    const resources: { dispose: () => void }[] = [];
    try {
      canvas.className = "block size-full touch-pan-y cursor-grab active:cursor-grabbing";
      canvas.setAttribute("aria-hidden", "true");
      element.appendChild(canvas);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 1.75));
      renderer.setClearColor(0, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 160);
      const sculpture = new THREE.Group();
      scene.add(sculpture);
      const keep = <T extends { dispose: () => void }>(resource: T): T => {
        resources.push(resource);
        return resource;
      };
      let environmentTarget: THREE.WebGLRenderTarget | null = null;
      const refreshEnvironment = () => {
        const environment = new RoomEnvironment();
        const pmrem = new THREE.PMREMGenerator(renderer);
        try {
          environmentTarget?.dispose();
          environmentTarget = keep(pmrem.fromScene(environment, 0.04));
          scene.environment = environmentTarget.texture;
        } finally {
          environment.dispose();
          pmrem.dispose();
        }
      };
      refreshEnvironment();
      scene.add(new THREE.HemisphereLight(0xdce9ee, 0x80644b, 2));
      const rim = new THREE.DirectionalLight(0xc8e7ff, 4);
      rim.position.set(5, 4, -3); scene.add(rim);
      const warm = new THREE.DirectionalLight(0xf8c999, 3);
      warm.position.set(-4, 2, 5); scene.add(warm);

      const positions = new Float32Array(GRID_COUNT * 3);
      const targets = new Float32Array(positions.length);
      writeGrid(positions, input.current.progress, input.current.form, 0);
      const topology = makeTopology();
      const surfaceGeometry = keep(new THREE.BufferGeometry());
      const positionAttribute = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
      surfaceGeometry.setAttribute("position", positionAttribute);
      surfaceGeometry.setIndex(new THREE.BufferAttribute(topology.faces, 1));
      surfaceGeometry.computeVertexNormals();
      surfaceGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 28);
      const surfaceMaterial = keep(new THREE.MeshPhysicalMaterial({
        color: 0x82969d, metalness: 0.85, roughness: 0.24, transparent: true,
        opacity: 0.26, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6,
      }));
      const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      sculpture.add(surface);
      const edgeGeometry = keep(new THREE.BufferGeometry());
      edgeGeometry.setAttribute("position", positionAttribute);
      edgeGeometry.setIndex(new THREE.BufferAttribute(topology.edges, 1));
      edgeGeometry.boundingSphere = surfaceGeometry.boundingSphere;
      const edgeMaterial = keep(new THREE.LineBasicMaterial({ color: 0xbac9cd, transparent: true, opacity: 0.3 }));
      sculpture.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
      // The two long edges join into the strip's single continuous boundary.
      const boundaryIndices: number[] = [];
      for (const row of [0, GRID_SIDE - 1]) {
        for (let col = 0; col < GRID_SIDE - 1; col++) {
          const index = row * GRID_SIDE + col;
          boundaryIndices.push(index, index + 1);
        }
      }
      const boundaryGeometry = keep(new THREE.BufferGeometry());
      boundaryGeometry.setAttribute("position", positionAttribute);
      boundaryGeometry.setIndex(boundaryIndices);
      boundaryGeometry.boundingSphere = surfaceGeometry.boundingSphere;
      const boundaryMaterial = keep(new THREE.LineBasicMaterial({ color: 0xd8e0e1, transparent: true, opacity: 0.12 }));
      sculpture.add(new THREE.LineSegments(boundaryGeometry, boundaryMaterial));
      scene.fog = new THREE.FogExp2(input.current.dark ? 0x0a0a0a : 0xffffff, 0.036);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const ripple = new THREE.Vector3();
      let pulseStart = -20;
      let pulseId = input.current.pulse;
      let time = 0, last = 0, frame = 0;
      let visible = true, lost = false, disposed = false;
      let announcedReady = false;
      let lastSignature = "", theme: boolean | null = null;
      let drag: { x: number; y: number; yaw: number; pitch: number; moved: boolean; id: number } | null = null;

      const size = () => {
        const { width, height } = element.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        lastSignature = "";
      };
      const draw = (now: number) => {
        frame = 0;
        if (disposed || lost || !visible || document.hidden) return;
        const dt = Math.min((now - (last || now)) / 1000, 0.04);
        last = now;
        const state = input.current;
        const still = reduced.matches;
        if (!still) time += dt;
        const signature = `${state.progress.toFixed(4)}:${state.form}:${state.yaw}:${state.pitch}:${state.pulse}:${state.dark}:${still}`;
        if (!still || signature !== lastSignature) {
          lastSignature = signature;
          if (theme !== state.dark) {
            theme = state.dark;
            edgeMaterial.color.set(theme ? 0xc3d4dc : 0x57626b);
            boundaryMaterial.color.set(theme ? 0xd8e0e1 : 0x525e63);
            (scene.fog as THREE.FogExp2).color.set(theme ? 0x0a0a0a : 0xffffff);
          }
          if (pulseId !== state.pulse) { pulseId = state.pulse; pulseStart = time; ripple.set(0, 0, 0); }
          const progress = THREE.MathUtils.clamp(state.progress, 0, 2);
          const { expand: expansion, ribbon } = gridPhases(progress);
          writeGrid(targets, progress, state.form, still ? 0 : time);
          const damping = still ? 1 : 1 - Math.exp(-dt * 8);
          for (let i = 0; i < GRID_COUNT; i++) {
            const k = i * 3;
            const distance = Math.hypot(targets[k] - ripple.x, targets[k + 2] - ripple.z);
            const age = time - pulseStart;
            const wave = !still && age < 3 ? Math.sin(distance * 3.5 - age * 7) * Math.exp(-Math.pow(distance - age * 3, 2) * 0.7) * Math.exp(-age) * 0.3 : 0;
            for (let axis = 0; axis < 3; axis++) positions[k + axis] += (targets[k + axis] + (axis === 1 ? wave : 0) - positions[k + axis]) * damping;
          }
          positionAttribute.needsUpdate = true;
          surfaceGeometry.computeVertexNormals();
          surfaceMaterial.opacity = (0.3 + 0.35 * ribbon) * (1 - expansion);
          boundaryMaterial.opacity = 0.12 + ribbon * 0.6;
          edgeMaterial.opacity = (state.dark ? 0.24 : 0.19) + Math.sin(progress * Math.PI / 2) * 0.2;
          sculpture.rotation.set(0.12 + state.pitch, state.yaw + (still ? 0.25 : Math.sin(time * 0.08) * 0.15 + 0.25), -0.12 * (1 - expansion));
          const distance = camera.aspect < 0.9 ? 15 : 12;
          camera.position.set(0, 5.3 - expansion * 2.5, distance + expansion * 3);
          camera.lookAt(0, -0.25 - expansion * 0.8, 0);
          renderer.render(scene, camera);
          if (!announcedReady) {
            announcedReady = true;
            onStatus("ready");
          }
        }
        frame = requestAnimationFrame(draw);
      };
      const wake = () => {
        if (!frame && !disposed && !lost && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(draw); }
      };
      const visibility = () => {
        if (document.hidden || !visible) { cancelAnimationFrame(frame); frame = 0; }
        else wake();
      };
      const sight = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
      sight.observe(element);
      const resize = new ResizeObserver(size); resize.observe(element);
      const down = (event: PointerEvent) => {
        if (event.button !== 0) return;
        drag = { x: event.clientX, y: event.clientY, yaw: input.current.yaw, pitch: input.current.pitch, moved: false, id: event.pointerId };
      };
      const move = (event: PointerEvent) => {
        if (!drag || drag.id !== event.pointerId) return;
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 5) {
          drag.moved = true; canvas.setPointerCapture(event.pointerId);
          input.current.yaw = drag.yaw + dx * 0.006;
          input.current.pitch = THREE.MathUtils.clamp(drag.pitch + (event.pointerType === "touch" ? 0 : dy * 0.003), -0.5, 0.5);
        }
      };
      const up = (event: PointerEvent) => {
        if (drag && !drag.moved) {
          const bounds = canvas.getBoundingClientRect();
          pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObject(surface)[0];
          ripple.copy(hit ? sculpture.worldToLocal(hit.point) : new THREE.Vector3());
          pulseStart = time;
        }
        drag = null;
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      };
      const cancel = () => { drag = null; };
      const leave = () => { if (drag && !drag.moved) drag = null; };
      const contextLost = (event: Event) => {
        event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; onStatus("unavailable");
      };
      const restored = () => {
        try {
          refreshEnvironment();
          lost = false; announcedReady = false; lastSignature = ""; wake();
        } catch { onStatus("unavailable"); }
      };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", cancel);
      canvas.addEventListener("pointerleave", leave);
      canvas.addEventListener("webglcontextlost", contextLost);
      canvas.addEventListener("webglcontextrestored", restored);
      document.addEventListener("visibilitychange", visibility);
      size(); wake();
      return () => {
        disposed = true; cancelAnimationFrame(frame);
        sight.disconnect(); resize.disconnect();
        document.removeEventListener("visibilitychange", visibility);
        canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", cancel);
        canvas.removeEventListener("pointerleave", leave);
        canvas.removeEventListener("webglcontextlost", contextLost); canvas.removeEventListener("webglcontextrestored", restored);
        resources.forEach((resource) => resource.dispose());
        renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
      };
    } catch {
      resources.forEach((resource) => resource.dispose());
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
      onStatus("unavailable");
    }
  }, [input, onStatus]);

  return <div ref={host} role="img" aria-label={label} className="size-full" />;
}
