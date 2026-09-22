"use client";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useScrollReveals } from "@/hooks/use-scroll-reveals";
import { GRID_COUNT, GRID_SIDE, writeGrid } from "./vision-geometry";
import type { VisionInput } from "./vision-scene";

const VisionScene = dynamic(() => import("./vision-scene"), { ssr: false });
const chapters = ["possibility", "connection", "infinity"] as const;
// Keep the original 320svh animation pacing; the extra 60svh holds its end frame.
const getAnimationRange = (story: HTMLElement, stage: HTMLElement) =>
  Math.max(1, story.offsetHeight * (320 / 380) - stage.offsetHeight);
const fallbackPositions = new Float32Array(GRID_COUNT * 3);
writeGrid(fallbackPositions, 0, 0, 0);
const projectPoint = (i: number) => {
  const [x, y, z] = fallbackPositions.slice(i * 3, i * 3 + 3);
  return `${400 + (x - z) * 42},${240 + (x + z) * 16 - y * 38}`;
};

function GridFallback() {
  return (
    <svg viewBox="0 0 800 480" className="size-full text-foreground/25" aria-hidden="true">
      {Array.from({ length: GRID_SIDE }, (_, row) => (
        <g key={row} fill="none" stroke="currentColor" strokeWidth="0.65">
          <polyline points={Array.from({ length: GRID_SIDE }, (_, col) => projectPoint(row * GRID_SIDE + col)).join(" ")} />
          <polyline points={Array.from({ length: GRID_SIDE }, (_, col) => projectPoint(col * GRID_SIDE + row)).join(" ")} />
        </g>
      ))}
    </svg>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function VisionPageClient() {
  const t = useTranslations("Vision.Experience");
  const { resolvedTheme } = useTheme();
  const story = useRef<HTMLElement>(null);
  useScrollReveals(story);
  const stage = useRef<HTMLDivElement>(null);
  const progressLine = useRef<HTMLDivElement>(null);
  const input = useRef<VisionInput>({ progress: 0, form: 0, yaw: 0, pitch: 0, pulse: 0, dark: true });
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [retry, setRetry] = useState(0);
  const handleStatus = useCallback((value: "ready" | "unavailable") => setStatus(value), []);
  const handleFailure = useCallback(() => setStatus("unavailable"), []);

  useEffect(() => { input.current.dark = resolvedTheme !== "light"; }, [resolvedTheme]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!story.current || !stage.current) return;
      const inset = parseFloat(getComputedStyle(stage.current).top) || 0;
      const range = getAnimationRange(story.current, stage.current);
      const progress = Math.max(0, Math.min(1, (inset - story.current.getBoundingClientRect().top) / Math.max(1, range)));
      input.current.progress = progress * 2;
      setActive(Math.min(2, Math.round(progress * 2)));
      if (progressLine.current) progressLine.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    if (story.current) resize.observe(story.current);
    if (stage.current) resize.observe(stage.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
    };
  }, []);

  const navigate = (index: number) => {
    if (!story.current || !stage.current) return;
    const inset = parseFloat(getComputedStyle(stage.current).top) || 0;
    const range = getAnimationRange(story.current, stage.current);
    window.scrollTo({
      top: window.scrollY + story.current.getBoundingClientRect().top - inset + range * index / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <main className="bg-background pt-28 text-foreground [--vision-gutter:clamp(20px,4.2vw,72px)] [--vision-content-inset:1.25rem] sm:[--vision-content-inset:2rem] md:pt-[72px] md:[--vision-content-inset:2.5rem]">
      <section ref={story} aria-label={t("label")} className="relative h-[380svh]">
        <div ref={stage} data-navbar-pinned-stage className="sticky top-28 isolate h-[calc(100svh-112px)] min-h-[540px] overflow-hidden bg-background md:top-[72px] md:h-[calc(100svh-72px)] md:min-h-[560px]">
          <span data-scroll-reveal="line-x" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 border-t border-foreground/15" />
          <span data-scroll-reveal="line-x" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 border-b border-foreground/15" />
          <div data-scroll-reveal="line-y" aria-hidden="true" className="pointer-events-none absolute inset-y-0 inset-x-[calc(var(--vision-gutter)-1px)] border-x border-foreground/12" />
          <div data-scroll-reveal="fade" data-reveal-delay="120" className="absolute inset-x-0 top-[28%] bottom-[calc(10rem+env(safe-area-inset-bottom))] md:top-[7%] md:bottom-[max(10rem,16%)] md:left-[32%]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_58%_42%,#e9c9a526,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_58%_42%,#7896a01c,transparent_65%)]" />
            <div className={cn("pointer-events-none absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none", status === "ready" ? "opacity-0" : "opacity-100")}>
              <GridFallback />
            </div>
            <div
              tabIndex={status === "ready" ? 0 : -1}
              role="group"
              aria-label={t("interaction")}
              aria-describedby="vision-interaction-hint"
              className={cn("relative size-full outline-none transition-opacity duration-700 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-tertiary/50 motion-reduce:transition-none", status === "ready" ? "opacity-100" : "pointer-events-none opacity-0")}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") input.current.yaw -= 0.15;
                else if (event.key === "ArrowRight") input.current.yaw += 0.15;
                else if (event.key === "ArrowUp") input.current.pitch = Math.max(-0.5, input.current.pitch - 0.1);
                else if (event.key === "ArrowDown") input.current.pitch = Math.min(0.5, input.current.pitch + 0.1);
                else if (event.key === " " || event.key === "Enter") input.current.pulse++;
                else return;
                event.preventDefault();
              }}
            >
              <SceneBoundary key={retry} onFailure={handleFailure}>
                <VisionScene input={input} onStatus={handleStatus} label={t(`chapters.${chapters[active]}.scene`)} />
              </SceneBoundary>
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--background)_85%)]" />
            <div data-scroll-reveal="text" data-reveal-delay="450" className="absolute -bottom-9 inset-x-6 flex justify-center md:-bottom-8">
              <div className="flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 border border-foreground/10 bg-background/90 px-3 py-2 text-center text-[11px] leading-relaxed text-foreground/80 backdrop-blur-sm md:px-4 md:text-xs">
                <p id="vision-interaction-hint" className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true" className="size-4 shrink-0"><path d="M4 7a7 4 0 1 1 0 6M4 3v4h4" /></svg>
                  <span>{t(status === "unavailable" ? "fallback" : "hint")}</span>
                </p>
                {status === "unavailable" && <button type="button" className="min-h-8 shrink-0 cursor-pointer text-tertiary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary" onClick={() => { setStatus("loading"); setRetry(retry + 1); }}>{t("retry")}</button>}
              </div>
            </div>
          </div>

          <div data-scroll-reveal="text" data-reveal-delay="260" className="pointer-events-none absolute top-10 inset-x-[calc(var(--vision-gutter)+var(--vision-content-inset))] z-10 md:top-[22%] md:right-auto md:w-[43%]">
            {chapters.map((chapter, index) => {
              const Heading = index === 0 ? "h1" : "h2";
              return (
                <section key={chapter} id={`vision-${chapter}`} aria-hidden={active !== index} inert={active !== index} className={cn("absolute inset-x-0 top-0 transition-[opacity,transform,visibility] duration-500 ease-out motion-reduce:transition-none", active === index ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-3 opacity-0")}>
                  <Heading className="text-[clamp(28px,4vw,64px)] leading-[1.17] font-medium tracking-[-0.065em] [word-break:keep-all]">
                    <span className="block">{t(`chapters.${chapter}.line1`)}</span>
                    <span className="block text-foreground/55">{t(`chapters.${chapter}.line2`)}</span>
                  </Heading>
                  <p className="mt-4 max-w-[31em] text-[12px] leading-[1.85] tracking-[-0.015em] text-foreground/60 [word-break:keep-all] md:mt-7 md:max-w-[27em] md:text-[15px]">
                    {t(`chapters.${chapter}.description`)}
                  </p>

                </section>
              );
            })}
          </div>

          <div data-scroll-reveal="fade" data-reveal-delay="550" className="absolute inset-x-(--vision-gutter) bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 md:bottom-0">
            <p className="mb-4 flex animate-scroll-hint items-center justify-center gap-2 text-[11px] font-medium text-foreground/70 motion-reduce:animate-none md:mb-5 md:text-xs">
              <span>{t("scroll")}</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true" className="size-3.5 animate-scroll-cue motion-reduce:animate-none"><path d="M8 2v11m-4-4 4 4 4-4" /></svg>
            </p>
            <nav aria-label={t("navigation")} className="relative hidden grid-cols-3 border-t border-foreground/15 md:grid">
              <div ref={progressLine} aria-hidden="true" className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-tertiary" />
              {chapters.map((chapter, index) => (
                <button key={chapter} type="button" aria-current={active === index ? "step" : undefined} aria-controls={`vision-${chapter}`} onClick={() => navigate(index)} className={cn("group flex min-h-14 cursor-pointer items-center justify-between gap-2 border-r border-foreground/10 px-(--vision-content-inset) text-left transition-colors last:border-r-0 hover:bg-foreground/[0.025] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary md:min-h-16", active === index ? "text-foreground" : "text-foreground/35")}>
                  <span className="text-[11px] font-medium tracking-tight md:text-sm">{t(`chapters.${chapter}.label`)}</span>
                  <span className="font-mono text-[9px] md:text-[10px]">0{index + 1}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
