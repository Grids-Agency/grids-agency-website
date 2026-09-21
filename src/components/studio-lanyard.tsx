"use client";

import {
  Component,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";

function StaticPass() {
  return (
    <div
      className="flex size-full items-center justify-center py-16 lg:ml-[47.619%] lg:w-[52.381%]"
      aria-hidden="true"
    >
      <div className="relative aspect-[2/3] w-[min(75%,375px)] -rotate-6 rounded-2xl border border-black/10 bg-[#eeeeea] text-black shadow-xl">
        <span className="absolute -top-32 left-1/2 h-32 w-5 -translate-x-1/2 bg-neutral-400" />
        <Image
          src="/models/lanyard/grids-card-portrait.png"
          alt=""
          width={600}
          height={900}
          unoptimized
          className="relative size-full rounded-2xl"
        />
      </div>
    </div>
  );
}

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
  ssr: false,
  loading: StaticPass,
});

class LanyardBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function StudioLanyard() {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useInView(ref, { margin: "200px 0px", once: true });
  const visible = useInView(ref);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const handleUnavailable = useCallback(() => setFailed(true), []);
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative size-full"
      aria-label="GRIDS studio pass"
    >
      {(!ready || failed || reducedMotion) && <StaticPass />}
      {entered && !reducedMotion && !failed && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${ready ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <LanyardBoundary onError={handleUnavailable}>
            <Lanyard
              active={visible}
              onReady={handleReady}
              onUnavailable={handleUnavailable}
              portraitImage="/models/lanyard/portrait-new2.png"
              cardScale={1.25}
              position={[0, 0, 20]}
              horizontalOffset={5 / 21}
              frontImage="/models/lanyard/grids-card.svg"
              backImage="/models/lanyard/grids-card.svg"
              lanyardImage="/models/lanyard/plain-strap.svg"
            />
          </LanyardBoundary>
        </div>
      )}
    </div>
  );
}
