"use client";

import { useRef, useSyncExternalStore } from "react";
import { useInView, useReducedMotion } from "motion/react";
import Cubes from "@/components/Cubes";

const duration = { enter: 0.45, leave: 0.8 };
const subscribeToVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
const visibleSnapshot = () => !document.hidden;
const serverSnapshot = () => false;

const HeroBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reducedMotion = useReducedMotion();
  const pageVisible = useSyncExternalStore(subscribeToVisibility, visibleSnapshot, serverSnapshot);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden [container-type:size]">
      <Cubes
        gridSize={7}
        cellGap={5}
        maxAngle={40}
        radius={2.5}
        duration={duration}
        faceColor="var(--background)"
        borderStyle="1px solid color-mix(in srgb, var(--foreground) 30%, transparent)"
        rippleColor="var(--tertiary)"
        rippleSpeed={1.3}
        autoAnimate={visible && pageVisible && !reducedMotion}
        interactive={visible && pageVisible && !reducedMotion}
        rippleOnClick={!reducedMotion}
        className="w-[min(82cqw,82cqh,420px)]"
      />
    </div>
  );
};

export default HeroBackground;
