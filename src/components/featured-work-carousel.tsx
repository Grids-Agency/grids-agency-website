"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "reicon-react/icons/ArrowRight";
import { cn } from "@/lib/utils";
import { MetalButton } from "@/components/spectrumui/metal-button";

const projects = [
  { key: "tcl", video: "/videos/tcl.mp4" },
  { key: "aether", video: "/videos/aether-hero-small.mp4" },
  { key: "jiam", video: "/videos/jiam.mp4" },
] as const;

export default function FeaturedWorkCarousel() {
  const t = useTranslations("About.layout");
  const locale = useLocale();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({ open: [0, 1], active: 0 });
  const selectionRef = useRef(selection);
  const syncPlayback = useRef<(() => void) | null>(null);
  const pendingFocus = useRef<number | null>(null);
  const collapsed = projects.findIndex(
    (_, index) => !selection.open.includes(index),
  );

  useEffect(() => {
    selectionRef.current = selection;
    syncPlayback.current?.();
    if (pendingFocus.current !== null) {
      root.current
        ?.querySelector<HTMLElement>(
          `[data-work-content="${pendingFocus.current}"]`,
        )
        ?.focus({ preventScroll: true });
      pendingFocus.current = null;
    }
  }, [selection]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const videos = element.querySelectorAll("video");
    let visible = false;
    const sync = () => {
      const current = selectionRef.current;
      videos.forEach((video, index) => {
        const expanded = desktop.matches
          ? current.open.includes(index)
          : current.active === index;
        if (expanded && visible && !document.hidden && !reducedMotion.matches) {
          void video.play().catch(() => {
            /* Autoplay may be disabled by the browser. */
          });
        } else {
          video.pause();
        }
      });
    };
    syncPlayback.current = sync;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(element);
    desktop.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      videos.forEach((video) => video.pause());
      syncPlayback.current = null;
    };
  }, []);

  const expand = (index: number) => {
    pendingFocus.current = index;
    setSelection((current) => ({
      active: index,
      open: current.open.includes(index)
        ? current.open
        : [current.open[1], index],
    }));
  };

  return (
    <div
      ref={root}
      role="region"
      aria-label={t("carouselLabel")}
      className="@container/work"
    >
      <div
        className={cn(
          "grid grid-cols-1 items-stretch gap-(--work-gap) [--work-gap:0.5rem] md:[--work-gap:1.5rem] md:[--work-strip:3.5rem]",
          "md:[--work-card:calc((100cqw_-_var(--work-strip)_-_2*var(--work-gap))/2)]",
          "transition-[grid-template-columns] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          collapsed === 0 &&
            "md:grid-cols-[var(--work-strip)_var(--work-card)_var(--work-card)]",
          collapsed === 1 &&
            "md:grid-cols-[var(--work-card)_var(--work-strip)_var(--work-card)]",
          collapsed === 2 &&
            "md:grid-cols-[var(--work-card)_var(--work-card)_var(--work-strip)]",
        )}
      >
        {projects.map(({ key, video }, index) => {
          const mobileOpen = selection.active === index;
          const desktopOpen = selection.open.includes(index);
          return (
            <article
              key={key}
              className={cn(
                "relative grid min-h-16 min-w-0 overflow-hidden transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:block md:min-h-0",
                mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              {/* Intrinsic-height folds on mobile; fixed-width folds on desktop. */}
              <div className="min-h-0 overflow-hidden md:h-full">
                <div
                  id={`${id}-${key}`}
                  data-work-content={index}
                  tabIndex={-1}
                  aria-label={t(`${key}.title`)}
                  className={cn(
                    "flex w-full flex-col p-4 outline-none transition-[opacity,visibility] duration-400 motion-reduce:transition-none sm:p-6 md:h-full md:w-(--work-card) md:p-8 lg:p-10",
                    mobileOpen
                      ? "visible opacity-100"
                      : "pointer-events-none invisible opacity-0 delay-0",
                    desktopOpen
                      ? "md:pointer-events-auto md:visible md:opacity-100 md:delay-0"
                      : "md:pointer-events-none md:invisible md:opacity-0 md:delay-0",
                  )}
                >
                  <h3 className="text-xl font-medium tracking-[-0.035em] md:text-2xl">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground [word-break:keep-all] md:min-h-12 md:text-base">
                    {t(`${key}.description`)}
                  </p>
                  <div className="relative mt-5 aspect-[1.6/1] shrink-0 overflow-hidden border border-foreground/10 bg-foreground/[0.015]">
                    <video
                      src={video}
                      aria-label={t(`${key}.title`)}
                      className="absolute inset-0 h-full w-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  <div className="mt-auto pt-6">
                    <MetalButton asChild className="gap-3 rounded-none text-sm" wrapperClassName="rounded-none">
                      <Link href={`/${locale}/archive`}>
                        {t("learnMore")}
                        <ArrowRight size={15} aria-hidden="true" className="shrink-0" />
                      </Link>
                    </MetalButton>
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-expanded={false}
                aria-controls={`${id}-${key}`}
                aria-label={t("showProject", { title: t(`${key}.title`) })}
                onClick={() => expand(index)}
                className={cn(
                  "group absolute inset-1 flex cursor-pointer items-center justify-between gap-4 overflow-hidden bg-foreground/[0.035] px-5 py-3 text-foreground/70 transition-[opacity,visibility,background-color,color] duration-300 hover:bg-tertiary/10 hover:text-tertiary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary motion-reduce:transition-none md:flex-col md:px-0 md:py-5",
                  mobileOpen
                    ? "pointer-events-none invisible opacity-0"
                    : "visible opacity-100 delay-300",
                  desktopOpen
                    ? "md:pointer-events-none md:invisible md:opacity-0 md:delay-0"
                    : "md:pointer-events-auto md:visible md:opacity-100 md:delay-300",
                )}
              >
                <span aria-hidden="true" className="font-mono text-[10px]">
                  0{index + 1}
                </span>
                <span
                  aria-hidden="true"
                  className="min-w-0 flex-1 truncate text-left text-xs font-medium tracking-wide md:flex-none md:text-sm md:[writing-mode:vertical-rl]"
                >
                  {t(`${key}.title`)}
                </span>
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 rotate-90 transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none md:rotate-0 md:group-hover:-rotate-45"
                />
              </button>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <span className="absolute inset-1 border border-foreground/[0.08]" />
                <span className="absolute top-0 left-0 size-5 border-t-2 border-l-2 border-foreground/25" />
                <span className="absolute top-0 right-0 size-5 border-t-2 border-r-2 border-foreground/25" />
                <span className="absolute bottom-0 left-0 size-5 border-b-2 border-l-2 border-foreground/25" />
                <span className="absolute right-0 bottom-0 size-5 border-r-2 border-b-2 border-foreground/25" />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
