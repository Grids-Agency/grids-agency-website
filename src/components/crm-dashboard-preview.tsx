"use client";

import { useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

const initialBars = [30, 48, 38, 64, 46, 72, 62, 83, 70, 92];
const filteredBars = [40, 32, 57, 46, 68, 56, 81, 72, 96, 108];

/** A looping product demo, not a live dashboard or an interactive form. */
export default function CrmDashboardPreview() {
  const t = useTranslations("Possibilities.crm.demo");
  const root = useRef<HTMLDivElement>(null);
  const chartId = useId();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bounds = element.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    let sequence: gsap.core.Timeline;
    const context = gsap.context(() => {
      sequence = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
      sequence
        .set("[data-demo-scene]", { y: 0 })
        .set("[data-demo-cursor]", { left: 206, top: 126 })
        .set("[data-demo-pointer]", { scale: 1 })
        .set("[data-demo-menu], [data-demo-after], [data-demo-option-highlight]", { opacity: 0 })
        .set("[data-demo-before]", { opacity: 1 })
        .to("[data-demo-scene]", { y: -170, duration: 1.2, ease: "power2.inOut" }, 1)
        .to("[data-demo-cursor]", { left: 194, top: 300, duration: 1.2, ease: "power2.inOut" }, 1)
        .to("[data-demo-pointer]", { scale: 0.78, duration: 0.12, yoyo: true, repeat: 1 }, 2.3)
        .fromTo("[data-demo-menu]", { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.25 }, 2.45)
        .to("[data-demo-cursor]", { left: 194, top: 372, duration: 0.7, ease: "power2.inOut" }, 3.1)
        .to("[data-demo-option-highlight]", { opacity: 1, duration: 0.2 }, 3.65)
        .to("[data-demo-pointer]", { scale: 0.78, duration: 0.12, yoyo: true, repeat: 1 }, 4)
        .to("[data-demo-menu]", { opacity: 0, duration: 0.2 }, 4.3)
        .to("[data-demo-before]", { opacity: 0, duration: 0.2 }, 4.35)
        .to("[data-demo-after]", { opacity: 1, duration: 0.3 }, 4.35)
        .to("[data-demo-bar]", {
          attr: { height: (i: number) => filteredBars[i], y: (i: number) => 116 - filteredBars[i] },
          duration: 0.8, stagger: 0.025, ease: "power2.inOut",
        }, 4.4)
        .to("[data-demo-cursor]", { left: 206, top: 126, duration: 1.2, ease: "power2.inOut" }, 6)
        .to("[data-demo-scene]", { y: 0, duration: 1.2, ease: "power2.inOut" }, 6)
        .to("[data-demo-after]", { opacity: 0, duration: 0.4 }, 9.4)
        .to("[data-demo-before]", { opacity: 1, duration: 0.4 }, 9.4)
        .to("[data-demo-bar]", {
          attr: { height: (i: number) => initialBars[i], y: (i: number) => 116 - initialBars[i] },
          duration: 0.5, ease: "power2.inOut",
        }, 9.4);
    }, element);

    // Keep creation and playback together; read the real media preference after
    // mount instead of waiting on a nullable hydration-time motion hook.
    const syncPlayback = () => {
      if (media.matches) sequence.pause(0);
      else if (visible && !document.hidden) sequence.play();
      else sequence.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(element);
    media.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      context.revert();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none relative mt-6 ml-4 h-[264px] overflow-hidden rounded-tl-xl border-t border-l border-foreground/15 bg-[#fafafa] text-[#252525] select-none dark:bg-[#0c0c0c] dark:text-[#ededed]">
      <div className="absolute inset-x-0 top-0 z-30 flex h-8 items-center gap-1.5 border-b border-black/[0.07] dark:border-white/[0.08] bg-[#f2f2f2] px-3 dark:bg-[#111111]">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 border-l border-black/10 pl-3 text-[9px] font-medium tracking-wide text-neutral-500 dark:border-white/10 dark:text-neutral-500">{t("windowTitle")}</span>
      </div>
      <aside className="absolute top-8 bottom-0 left-0 z-10 w-[96px] border-r border-black/[0.07] dark:border-white/[0.08] bg-[#f2f2f2] px-2 pt-4 dark:bg-[#111111]">
        {(["overview", "heading", "orders"] as const).map((label, i) => (
          <div key={label} className={`mb-2 flex h-7 items-center gap-2 rounded-md px-2 text-[9px] ${i === 0 ? "bg-black/[0.06] font-medium text-neutral-900 dark:bg-white/10 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"}`}><svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">{i === 0 ? <path d="M2 13V8h3v5M7 13V3h3v10M12 13V6h2v7" /> : i === 1 ? <><circle cx="8" cy="5" r="2.5" /><path d="M3 14v-1a5 5 0 0 1 10 0v1" /></> : <><rect x="3" y="2" width="10" height="12" rx="1.5" /><path d="M6 6h4M6 9h4" /></>}</svg><span className="truncate">{t(label)}</span></div>
        ))}
        <div className="mt-6 flex items-center gap-1.5 border-t border-black/[0.07] pt-3 pl-2 text-[8px] text-neutral-500 dark:border-white/[0.08] dark:text-neutral-400"><span className="size-1 rounded-full bg-neutral-400" />{t("synced")}</div>
      </aside>
      <div className="absolute inset-x-0 top-8 bottom-0 overflow-hidden">
        <div data-demo-scene className="relative h-[420px] w-[580px] will-change-transform">
          <div className="absolute top-3 left-[110px] text-[12px] font-semibold tracking-tight">{t("overviewTitle")}</div>
          <div className="absolute top-9 left-[110px] flex gap-2">
            {[
              { label: "revenue", before: "₩24.8M", after: "₩68.4M", change: "+8.2%" },
              { label: "orders", before: "1,842", after: "4,960", change: "+4.1%" },
              { label: "averageOrder", before: "₩154,600", after: "₩168,200", change: "+1.3%" },
            ].map(({ label, before, after, change }) => (
              <div key={label} className="w-[128px] overflow-hidden rounded-md border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-[#191919]">
                <div className="relative px-2.5 pt-2 pb-1.5">
                  <p className="text-[7px] text-neutral-500 dark:text-neutral-400">{t(label)}</p>
                  <div className="relative mt-1 text-[14px] font-semibold leading-5 tracking-tight tabular-nums"><span data-demo-before>{before}</span><span data-demo-after className="absolute inset-0 opacity-0">{after}</span></div>
                  <svg viewBox="0 0 30 22" className="absolute right-2 bottom-2 h-4 w-5 text-neutral-300 dark:text-neutral-600">{[8, 13, 10, 20, 15, 11].map((height, i) => <path key={i} d={`M${i * 5 + 1} 22v-${height}`} stroke="currentColor" strokeWidth="3" strokeDasharray="2 1" />)}</svg>
                </div>
                <div className="border-t border-black/[0.04] bg-neutral-50 px-2.5 py-1 text-[6px] dark:border-white/[0.04] dark:bg-[#141414]"><span className="text-emerald-600 dark:text-emerald-400">↑ {change}</span><span className="ml-1 text-neutral-500">{t("comparison")}</span></div>
              </div>
            ))}
          </div>
          <div className="absolute top-[112px] left-[110px] h-[138px] w-[410px] overflow-hidden rounded-md border border-black/[0.07] bg-white dark:border-white/[0.07] dark:bg-[#181818]">
            <div className="flex h-5 items-center justify-between border-b border-black/[0.05] bg-neutral-50 px-2.5 text-[7px] text-neutral-500 dark:border-white/[0.05] dark:bg-[#111111]"><span>{t("salesOverview")}</span><span className="text-emerald-600 dark:text-emerald-400">↑ 1.5%</span></div>
            <div className="flex items-center justify-between px-2.5 pt-2"><div><div className="relative text-[15px] font-semibold leading-5 tracking-tight tabular-nums"><span data-demo-before>₩24,800,000</span><span data-demo-after className="absolute inset-0 opacity-0">₩68,400,000</span></div><p className="text-[7px] text-neutral-500">{t("revenue")}</p></div><div className="flex divide-x divide-black/10 overflow-hidden rounded border border-black/10 text-[7px] dark:divide-white/10 dark:border-white/10"><span className="px-1.5 py-1">14D</span><span className="relative px-1.5 py-1"><span data-demo-before className="absolute inset-0 bg-black/5 dark:bg-white/10" /><span className="relative">1M</span></span><span className="relative px-1.5 py-1"><span data-demo-after className="absolute inset-0 bg-black/5 opacity-0 dark:bg-white/10" /><span className="relative">3M</span></span><span className="px-1.5 py-1">6M</span></div></div>
            <svg viewBox="0 0 360 120" preserveAspectRatio="none" className="mx-2.5 mt-2 h-[67px] w-[calc(100%_-_20px)]" fill="none">
              <defs>
                <pattern id={`${chartId}-segments`} width="4" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="5.5" fill="white" /></pattern>
                <mask id={`${chartId}-bars`}><rect width="360" height="120" fill={`url(#${chartId}-segments)`} /></mask>
              </defs>
              {[28, 72, 116].map((y) => <path key={y} d={`M0 ${y}H360`} stroke="currentColor" strokeOpacity="0.07" strokeDasharray="2 5" />)}
              <g mask={`url(#${chartId}-bars)`}>{initialBars.map((height, i) => <rect key={i} data-demo-bar x={10 + i * 35} y={116 - height} width="22" height={height} className={i % 3 === 0 ? "fill-neutral-500 dark:fill-neutral-400" : "fill-neutral-300 dark:fill-neutral-600"} />)}</g>
            </svg>
          </div>
          <div className="absolute top-[264px] left-[110px] flex gap-3">
            <div className="relative w-[154px]">
              <p className="mb-1.5 text-[9px] opacity-55">{t("periodLabel")}</p>
              <div className="flex h-8 items-center justify-between rounded-md border border-black/10 bg-white px-3 text-[10px] dark:border-white/10 dark:bg-[#1b1b1b]"><span className="relative"><span data-demo-before>{t("last30")}</span><span data-demo-after className="absolute inset-0 whitespace-nowrap opacity-0">{t("last90")}</span></span><span>⌄</span></div>
              <div data-demo-menu className="absolute top-[60px] left-0 z-20 w-full overflow-hidden rounded-lg border border-black/10 bg-white p-1 opacity-0 shadow-[0_8px_24px_#00000018] dark:border-white/10 dark:bg-[#242424]">
                <div className="flex h-7 items-center justify-between px-2 text-[10px]"><span>{t("last30")}</span><span className="opacity-50">✓</span></div>
                <div className="relative flex h-7 items-center px-2 text-[10px]"><span data-demo-option-highlight className="absolute inset-0 rounded bg-black/5 opacity-0 dark:bg-white/10" /><span className="relative">{t("last90")}</span></div>
              </div>
            </div>
            <div className="w-[130px]"><p className="mb-1.5 text-[9px] opacity-55">{t("teamLabel")}</p><div className="flex h-8 items-center justify-between rounded-md border border-black/10 bg-white px-3 text-[10px] dark:border-white/10 dark:bg-[#1b1b1b]"><span>{t("allTeams")}</span><span>⌄</span></div></div>
          </div>
          <div className="absolute top-[338px] left-[110px] w-[300px] rounded-lg border border-black/[0.07] dark:border-white/[0.08] bg-white px-3 py-3 dark:bg-[#181818]"><p className="text-[9px] opacity-50">{t("summary")}</p><div className="relative mt-2 text-[11px]"><span data-demo-before>{t("summary30")}</span><span data-demo-after className="absolute inset-0 opacity-0">{t("summary90")}</span></div><div className="relative mt-3 h-3 text-[8px] text-[#296b52] dark:text-[#83c4ae]"><span data-demo-after className="absolute inset-0 opacity-0">✓ {t("filterApplied")}</span></div></div>
          <div data-demo-cursor className="pointer-events-none absolute top-[126px] left-[206px] z-40">
            <svg data-demo-pointer width="24" height="29" viewBox="0 0 20 24" className="origin-top-left drop-shadow-[0_2px_3px_#0008]"><path d="M2 1.5v17l4.8-4 3.5 7 3.2-1.6-3.5-6.8 6.2-.6L2 1.5Z" fill="white" stroke="#20262d" strokeWidth="1.6" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
