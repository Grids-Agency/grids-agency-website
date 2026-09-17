"use client";

import React from "react";
import FastMarquee from "react-fast-marquee";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right" | "up" | "down";
  fade?: boolean;
  fadeAmount?: number;
}

// Keep presentation here; react-fast-marquee owns measurement and scrolling.
export function Marquee({
  children,
  className,
  speed = 42,
  pauseOnHover = false,
  direction = "left",
  fade = true,
  fadeAmount = 10,
  style,
  ...props
}: MarqueeProps) {
  const isVertical = direction === "up" || direction === "down";
  const edge = Math.min(49, Math.max(0, fadeAmount));

  return (
    <div
      className={cn("group/marquee relative isolate flex w-full overflow-hidden [contain:paint]", isVertical && "flex-col", className)}
      style={{
        "--marquee-fade": `${edge}%`,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      <div aria-hidden="true" className="w-full motion-reduce:hidden">
        <FastMarquee
          autoFill
          speed={speed}
          direction={direction}
          pauseOnHover={pauseOnHover}
          gradient={false}
          className="[&_.rfm-marquee]:will-change-transform"
        >
          {children}
        </FastMarquee>
      </div>
      <div className="sr-only motion-reduce:not-sr-only motion-reduce:flex motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-around motion-reduce:gap-y-4">
        {children}
      </div>
      {/* Stationary fades avoid masking the moving text layer every frame. */}
      {fade && <>
        <span aria-hidden="true" className={cn(
          "pointer-events-none absolute z-10 from-background to-transparent",
          isVertical
            ? "inset-x-0 top-0 h-[var(--marquee-fade)] bg-linear-to-b"
            : "inset-y-0 left-0 w-[var(--marquee-fade)] bg-linear-to-r",
        )} />
        <span aria-hidden="true" className={cn(
          "pointer-events-none absolute z-10 from-background to-transparent",
          isVertical
            ? "inset-x-0 bottom-0 h-[var(--marquee-fade)] bg-linear-to-t"
            : "inset-y-0 right-0 w-[var(--marquee-fade)] bg-linear-to-l",
        )} />
      </>}
    </div>
  );
}
