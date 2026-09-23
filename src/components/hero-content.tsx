"use client";

import { ArrowRight } from "reicon-react/icons/ArrowRight";
import { Infinite } from "reicon-react/icons/Infinite";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import HeroClientHeatmap from "@/components/hero-client-heatmap";
import { HERO_CLIENT_COUNT } from "@/data/hero-clients";
import { MetalButton } from "@/components/spectrumui/metal-button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const gridRevealClassName = "group-data-[hero-pending=true]/hero:opacity-0";
const textRevealClassName =
  "group-data-[hero-pending=true]/hero:opacity-0 group-data-[hero-pending=true]/hero:blur-[10px]";
const actionClassName =
  "relative inline-flex min-h-10 items-center justify-center gap-6 px-5 py-2.5 text-xs font-medium transition-colors duration-[180ms] motion-reduce:transition-none";

export default function HeroContent() {
  const t = useTranslations("Hero");
  const navT = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <section
      className="relative z-10 mx-[clamp(20px,4.2vw,72px)] flex min-h-svh flex-col pt-28 pb-8 text-foreground md:pt-18 md:pb-12 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-[5px] [&_a:focus-visible]:outline-tertiary"
      aria-labelledby="hero-heading"
    >
      <span
        data-hero-reveal="grid"
        aria-hidden="true"
        className={cn(gridRevealClassName, "pointer-events-none absolute inset-y-0 -inset-x-px border-x border-foreground/12")}
      />
      <div className="flex flex-none flex-col justify-end gap-6 px-5 pt-8 pb-6 sm:px-8 md:min-h-[clamp(372px,calc(60svh-48px),632px)] md:flex-1 md:gap-10 md:px-10 md:pt-12 md:pb-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1
            id="hero-heading"
            className="text-[clamp(34px,6vw,76px)] leading-[1.13] font-[450] tracking-[-0.055em] [word-break:keep-all]"
          >
            <span data-hero-reveal="text" className={cn(textRevealClassName, "block")}>
              {t("headline_lead")}
            </span>
            <span data-hero-reveal="text" className={cn(textRevealClassName, "block")}>
              {t("headline_prefix")}
            </span>
          </h1>
          <div className="mt-6 max-w-xl text-sm leading-[1.8] [word-break:keep-all] md:text-base">
            <p data-hero-reveal="text" className={cn(textRevealClassName, "font-medium")}>
              {t("studio_description")}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              data-hero-reveal="text"
              href={`/${locale}/archive`}
              className={cn(textRevealClassName, actionClassName, "hover:text-tertiary")}
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute top-0 left-0 size-3 border-t border-l border-current" />
                <span className="absolute top-0 right-0 size-3 border-t border-r border-current" />
                <span className="absolute bottom-0 left-0 size-3 border-b border-l border-current" />
                <span className="absolute right-0 bottom-0 size-3 border-r border-b border-current" />
              </span>
              {navT("work")} <Infinite size={16} aria-hidden="true" />
            </Link>
            <div data-hero-reveal="text" className={cn(textRevealClassName, "inline-flex")}>
              <MetalButton asChild className="h-10 gap-6 rounded-none px-5 text-xs" wrapperClassName="rounded-none">
                <Link
                  href={`/${locale}/connect`}
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_location: "hero",
                      cta_text: t("start_project"),
                    })
                  }
                >
                  {t("start_project")} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </MetalButton>
            </div>
          </div>
        </div>
        <div data-hero-reveal="text" className={cn(textRevealClassName, "flex shrink-0 items-center gap-3 md:gap-4 lg:pb-1")}>
          <span className="text-2xl leading-none font-light tracking-[-0.06em] tabular-nums md:text-4xl">{HERO_CLIENT_COUNT}</span>
          <div className="border-l border-foreground/20 pl-3 text-[11px] leading-5 md:pl-4 md:text-xs md:leading-6">
            <p className="font-medium">{t("heatmap.clients")}</p>
            <p className="text-foreground/50">{t("heatmap.meaning")}</p>
          </div>
        </div>
      </div>
      <HeroClientHeatmap clientCount={HERO_CLIENT_COUNT} />
    </section>
  );
}
