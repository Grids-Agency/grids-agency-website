"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BASE_CAPACITY = 216;

export default function HeroClientHeatmap({ clientCount }: { clientCount: number }) {
  const t = useTranslations("Hero.heatmap");
  const count = Number.isFinite(clientCount) ? Math.max(0, Math.floor(clientCount)) : 0;
  const capacity = Math.max(BASE_CAPACITY, Math.ceil(count / BASE_CAPACITY) * BASE_CAPACITY);
  const [cellOrder, setCellOrder] = useState<number[]>([]);

  useEffect(() => {
    // Shuffle after hydration, beneath the intro, so server and client markup match.
    const frame = requestAnimationFrame(() => {
      const order = Array.from({ length: capacity }, (_, index) => index);
      for (let index = order.length - 1; index > 0; index--) {
        const target = Math.floor(Math.random() * (index + 1));
        [order[index], order[target]] = [order[target], order[index]];
      }
      setCellOrder(order);
    });
    return () => cancelAnimationFrame(frame);
  }, [capacity]);

  // Stable initial positions also serve as the no-JavaScript fallback.
  const initialOrder = Array.from({ length: count }, (_, index) =>
    Math.floor(index / BASE_CAPACITY) * BASE_CAPACITY + ((index * 83 + 19) % BASE_CAPACITY),
  );
  const filled = new Set(cellOrder.length === capacity ? cellOrder.slice(0, count) : initialOrder);

  return (
    <figure className="relative m-0">
      <span
        data-hero-reveal="grid"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 inset-x-[calc(-1*clamp(20px,4.2vw,72px))] border-y border-foreground/12 group-data-[hero-pending=true]/hero:opacity-0"
      />
      <div
        data-hero-reveal="grid"
        role="img"
        aria-label={t("accessible", { count })}
        className="relative grid grid-cols-18 gap-[5px] px-5 pt-4 sm:grid-cols-27 sm:px-8 sm:pt-6 md:grid-cols-36 md:gap-[7px] md:px-10 md:pt-8 group-data-[hero-pending=true]/hero:opacity-0"
      >
        {Array.from({ length: capacity }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            data-filled={filled.has(index)}
            className={cn(
              "aspect-square border transition-colors duration-500 motion-reduce:transition-none",
              filled.has(index)
                ? "border-tertiary/70 bg-tertiary/80 shadow-[0_0_12px_color-mix(in_srgb,var(--tertiary)_18%,transparent)]"
                : "border-foreground/8 bg-foreground/[0.035]",
            )}
          />
        ))}
      </div>
      <figcaption
        data-hero-reveal="text"
        className="flex flex-col items-start gap-4 px-5 py-6 text-xs leading-5 text-foreground/75 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:px-8 md:px-10 group-data-[hero-pending=true]/hero:opacity-0 group-data-[hero-pending=true]/hero:blur-[10px]"
      >
        <span className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-medium text-foreground/90 md:text-xs">
          <span className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-3.5 shrink-0 border border-tertiary bg-tertiary/80 md:size-3" />{t("filled")}</span>
          <span className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-3.5 shrink-0 border border-foreground/40 bg-foreground/5 md:size-3" />{t("empty")}</span>
        </span>
        <span className="self-end text-right sm:ml-auto sm:self-auto">{t("caption")}</span>
      </figcaption>
    </figure>
  );
}
