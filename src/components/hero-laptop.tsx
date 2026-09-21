"use client";

import { useRef, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

const letters = Array.from("GRIDS AGENCY");
const subscribeToVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
const visibleSnapshot = () => !document.hidden;
const serverSnapshot = () => false;
const animationState = "group-data-[active=false]/laptop:[animation-play-state:paused] motion-reduce:animate-none";

export default function HeroLaptop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pageVisible = useSyncExternalStore(subscribeToVisibility, visibleSnapshot, serverSnapshot);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-active={inView && pageVisible}
      className="group/laptop pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-5 py-10 sm:px-8 md:px-5 lg:px-8"
    >
      <div className="relative w-full max-w-[620px] pb-[3%]">
        <div className="absolute -bottom-[5%] left-[8%] h-[9%] w-[84%] rounded-[50%] bg-black/25 blur-xl dark:bg-black/70" />

        {/* A machined rim, dark bezel, and small camera frame the display. */}
        <div className="relative mx-auto w-[90%] rounded-t-[clamp(10px,2vw,18px)] rounded-b-[3px] bg-linear-to-br from-[#c0c2c5] via-[#686a6f] to-[#b6b8be] p-[2px] shadow-[0_12px_40px_-12px_#0007]">
          <div className="relative rounded-t-[clamp(8px,1.8vw,16px)] bg-[#111215] px-[2%] pt-[3.5%] pb-[2%]">
            <span className="absolute top-[2.1%] left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-[#263641] ring-1 ring-black" />
            <div className="@container relative isolate aspect-[16/10] overflow-hidden rounded-[2px] bg-[#101625]">
              {/* Fixed color stops keep hydration stable; independent motion mixes the colors. */}
              <div className={cn("absolute -inset-[35%] animate-laptop-drift bg-[radial-gradient(ellipse_at_25%_25%,#92c8c2_0%,transparent_48%),radial-gradient(ellipse_at_80%_60%,#a778b4_0%,transparent_50%),radial-gradient(ellipse_at_30%_90%,#db9d71_0%,transparent_50%)] blur-[22px]", animationState)} />
              <div className={cn("absolute -inset-[35%] animate-laptop-drift bg-[radial-gradient(ellipse_at_75%_20%,#b1c5a6_0%,transparent_38%),radial-gradient(ellipse_at_25%_75%,#4a6eac_0%,transparent_44%)] opacity-75 blur-[28px] [animation-delay:-11s] [animation-direction:reverse] [animation-duration:23s]", animationState)} />
              <div className="absolute inset-0 bg-black/25" />
              <div className="relative flex h-full flex-col items-center justify-center gap-[5cqw] text-white">
                <span className="size-[13cqw] bg-white [mask:url('/logo/grids-black.png')_center/contain_no-repeat] [-webkit-mask:url('/logo/grids-black.png')_center/contain_no-repeat] drop-shadow-[0_2px_10px_#0002]" />
                <div className="flex whitespace-pre text-[6cqw] leading-none font-semibold tracking-[0.08em]">
                  {letters.map((letter, index) => (
                    <span
                      key={index}
                      className={cn("inline-block animate-laptop-letter", animationState)}
                      style={{ animationDelay: `${index * 0.065}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(125deg,#ffffff12,transparent_45%,transparent_80%,#ffffff08)]" />
            </div>
          </div>
        </div>

        {/* Tapered aluminum deck with the central opening notch. */}
        <div className="relative h-[clamp(7px,1.2vw,12px)] border-t border-white/75 bg-[linear-gradient(90deg,#777b83_0%,#d1d4da_3%,#f0f1f3_18%,#b2b5bb_50%,#e8eaee_82%,#989da6_98%,#626771_100%)]">
          <div className="absolute -top-px left-1/2 h-[55%] w-[15%] -translate-x-1/2 rounded-b-[4px] bg-linear-to-b from-[#6e737c] to-[#c0c4cb] shadow-[0_1px_0_#fff8]" />
        </div>
        <div className="h-[clamp(3px,0.6vw,6px)] rounded-b-[50%_100%] bg-linear-to-b from-[#8b9098] to-[#454950]" />
      </div>
    </div>
  );
}
