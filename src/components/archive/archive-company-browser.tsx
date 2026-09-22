"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs } from "radix-ui";
import { motion, useReducedMotion } from "motion/react";
import { Folder } from "reicon-react/icons/Folder";
import { Home } from "reicon-react/icons/Home";
import { ArchiveEntry } from "./archive-entry";

const companies = ["jeisys", "tcl", "aether", "haneul"] as const;
type Company = typeof companies[number];
type ArchiveView = "home" | Company;

const tabClassName = "group flex min-h-12 w-full cursor-pointer items-center gap-2 border border-transparent px-2 py-3 text-left text-xs leading-5 text-inherit transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary data-[state=active]:border-foreground/10 data-[state=active]:bg-foreground/[0.07] data-[state=active]:font-medium motion-reduce:transition-none sm:gap-3 sm:px-3 sm:text-sm";
const panelClassName = "relative min-h-0 min-w-0 overflow-y-auto overscroll-contain p-5 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary sm:p-8 lg:p-12";

export function ArchiveCompanyBrowser() {
  const t = useTranslations("Archive.Browser");
  const [selected, setSelected] = useState<ArchiveView>("home");
  const [expanded, setExpanded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef(false);
  const firstCompanyRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (expanded) {
      if (focusOnOpen.current) homeRef.current?.focus({ preventScroll: true });
      return;
    }

    // Only a deliberate downward scroll on mobile opens the preview.
    // Intersection alone would expand it immediately on short screens.
    const startingScroll = window.scrollY;
    const onScroll = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      const preview = previewRef.current?.getBoundingClientRect();
      if (window.scrollY > startingScroll + 32 && preview && preview.top < window.innerHeight * 0.85) {
        setExpanded(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [expanded]);

  return (
    <section
      id="archive-companies"
      aria-label={t("title")}
      tabIndex={-1}
      data-expanded={expanded}
      className="relative z-10 min-h-svh bg-transparent px-[clamp(20px,4.2vw,72px)] pt-36 pb-[calc(32svh+6rem)] text-black outline-none data-[expanded=true]:pb-24 dark:text-white md:pt-28 md:pb-10 md:data-[expanded=true]:pb-10"
    >
      {/* All archive views live inside this single glass surface. */}
      <div
        ref={previewRef}
        data-expanded={expanded}
        className="relative origin-top translate-y-[32svh] scale-90 transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] data-[expanded=true]:translate-y-0 data-[expanded=true]:scale-100 motion-reduce:transition-none md:origin-top-right md:translate-y-0 md:scale-[0.58]"
      >
        {!expanded && (
          <button
            type="button"
            aria-expanded={false}
            aria-controls="archive-finder"
            onClick={() => {
              focusOnOpen.current = true;
              setExpanded(true);
            }}
            className="group absolute -inset-1 z-20 flex cursor-zoom-in items-end justify-center pb-5 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-tertiary"
          >
            <span className="border border-foreground/15 bg-background/90 px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-md transition-colors group-hover:bg-background motion-reduce:transition-none md:text-xl">
              {t("openFinder")}
              <span aria-hidden="true" className="ml-3">↗</span>
            </span>
          </button>
        )}
        <span aria-hidden="true" className="pointer-events-none absolute -top-1 -right-1 z-10 size-5 border-t-2 border-r-2 border-foreground/35" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-1 -left-1 z-10 size-5 border-b-2 border-l-2 border-foreground/35" />

        <Tabs.Root
          id="archive-finder"
          inert={!expanded}
          aria-hidden={!expanded}
          value={selected}
          onValueChange={(value) => setSelected(value as ArchiveView)}
          orientation="vertical"
          className="relative overflow-hidden border border-white/60 bg-white/25 shadow-[0_24px_80px_-32px_#0003,inset_0_1px_0_#fffc,inset_0_-1px_0_#fff4] backdrop-blur-[28px] backdrop-saturate-[1.6] dark:border-white/20 dark:bg-black/25 dark:shadow-[0_24px_80px_-32px_#0009,inset_0_1px_0_#fff4,inset_0_-1px_0_#ffffff0d]"
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,#ffffff40_0%,#ffffff08_35%,transparent_55%,#ffffff14_100%)] dark:opacity-50" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-linear-to-r from-transparent via-white/90 to-transparent dark:via-white/50" />
          <div className="relative grid h-[max(460px,calc(100svh-15rem))] grid-cols-[116px_minmax(0,1fr)] sm:grid-cols-[200px_minmax(0,1fr)] md:h-[max(520px,calc(100svh-9.5rem))] lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="mx-2 my-3 min-h-0 overflow-y-auto overscroll-contain bg-white/35 px-2 py-5 shadow-[inset_0_0_0_1px_#fff3] dark:bg-black/25 sm:mx-3 sm:my-4 sm:px-3 sm:py-6">
              <Tabs.List aria-label={t("navigationLabel")} className="flex flex-col gap-1.5">
                <Tabs.Trigger ref={homeRef} value="home" className={tabClassName}>
                  <Home size={17} className="hidden shrink-0 text-current group-data-[state=active]:text-tertiary sm:block" aria-hidden="true" />
                  {t("home")}
                </Tabs.Trigger>
                <span className="mt-7 mb-3 px-2 text-[10px] font-medium tracking-[0.06em] text-inherit sm:px-3 sm:text-xs">{t("sidebarLabel")}</span>
                {companies.map((company) => (
                  <Tabs.Trigger
                    key={company}
                    value={company}
                    ref={company === companies[0] ? firstCompanyRef : undefined}
                    className={tabClassName}
                  >
                    <Folder size={17} className="hidden shrink-0 text-current group-data-[state=active]:text-tertiary sm:block" aria-hidden="true" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{t(`companies.${company}`)}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
            <Tabs.Content value="home" className={`@container ${panelClassName}`}>
              <motion.div
                className="flex min-h-full"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <ArchiveEntry onExplore={() => {
                  setSelected(companies[0]);
                  firstCompanyRef.current?.focus();
                }} />
              </motion.div>
            </Tabs.Content>
            {companies.map((company) => (
              <Tabs.Content
                key={company}
                value={company}
                className={panelClassName}
              >
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                >
                  <p className="mb-4 font-mono text-[9px] tracking-[0.16em] text-inherit sm:text-[10px]">{t("panelLabel")}</p>
                  <h1 className="text-[clamp(20px,3vw,40px)] leading-tight font-medium tracking-[-0.045em] [overflow-wrap:anywhere]">{t(`companies.${company}`)}</h1>
                  {/* Company project content will be added here. */}
                </motion.div>
              </Tabs.Content>
            ))}
          </div>
        </Tabs.Root>
      </div>
    </section>
  );
}
