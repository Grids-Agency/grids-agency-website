"use client";

import { Component, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "motion/react";
import BrandLogo from "@/components/brand-logo";

function StaticPass() {
  return (
    <div className="flex size-full items-center justify-center py-16 lg:ml-[47.619%] lg:w-[52.381%]" aria-hidden="true">
      <div className="relative flex aspect-[2/3] w-[min(75%,375px)] -rotate-6 flex-col justify-between rounded-2xl border border-black/10 bg-[#eeeeea] p-8 text-black shadow-xl">
        <span className="absolute -top-32 left-1/2 h-32 w-5 -translate-x-1/2 bg-neutral-400" />
        <BrandLogo className="size-8 bg-black" />
        <span className="text-3xl font-medium tracking-tighter">GRIDS<br />AGENCY</span>
        <span className="font-mono text-xs">CREATIVE LAB / 001</span>
      </div>
    </div>
  );
}

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
  ssr: false,
  loading: StaticPass,
});

class LanyardBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticPass /> : this.props.children; }
}

export default function StudioLanyard() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "200px 0px" });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="size-full" aria-label="GRIDS studio pass">
      {visible && !reducedMotion ? (
        <LanyardBoundary>
          <Lanyard cardScale={1.25} position={[0, 0, 20]} horizontalOffset={5 / 21} frontImage="/models/lanyard/grids-card.svg" backImage="/models/lanyard/grids-card.svg" lanyardImage="/models/lanyard/plain-strap.svg" />
        </LanyardBoundary>
      ) : <StaticPass />}
    </div>
  );
}
