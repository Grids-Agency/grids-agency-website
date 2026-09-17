"use client";

import { ArrowRight } from "reicon-react/icons/ArrowRight";
import { Infinite } from "reicon-react/icons/Infinite";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Marquee } from "@/components/marquee";
import HeroBackground from "@/components/hero-background";
import { cn } from "@/lib/utils";

const gridRevealClassName = "group-data-[hero-pending=true]/hero:opacity-0";
const textRevealClassName =
  "group-data-[hero-pending=true]/hero:opacity-0 group-data-[hero-pending=true]/hero:blur-[10px]";

const dotClassName =
  "group-data-[hero-pending=true]/hero:opacity-0 pointer-events-none absolute z-2 size-[5px] rounded-full bg-tertiary";
const sideClassName =
  "flex flex-col justify-between gap-6 px-[18px] py-6 md:gap-8 md:px-[clamp(18px,2.6vw,40px)] md:py-[30px]";
const descriptionClassName =
  "max-w-[260px] text-xs font-medium leading-[1.65] text-black dark:text-white [word-break:keep-all] md:text-[13px]";
const actionClassName =
  "inline-flex min-h-10 items-center justify-center gap-6 border border-foreground px-5 py-2.5 text-xs font-medium transition-colors duration-[180ms] motion-reduce:transition-none";
const marqueePlaceholders = [
  "STUDIO ONE",
  "COMPANY TWO",
  "BRAND THREE",
  "PARTNER FOUR",
  "STUDIO FIVE",
  "COMPANY SIX",
];

const HeroContent = () => {
  const t = useTranslations("Hero");
  const navT = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <section
      className="relative z-10 mx-[clamp(20px,4.2vw,72px)] flex min-h-svh flex-col border-x border-transparent pt-28 text-foreground md:pt-18 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-[5px] [&_a:focus-visible]:outline-tertiary"
      aria-labelledby="hero-heading"
    >
      <span
        data-hero-reveal="grid"
        aria-hidden="true"
        className={cn(
          gridRevealClassName,
          "pointer-events-none absolute inset-y-0 -inset-x-px border-x border-foreground/17",
        )}
      />
      <div className="flex flex-col items-center justify-center px-4 pt-9 pb-10 text-center md:px-6 md:pt-[52px] md:pb-[60px]">
        <h1
          id="hero-heading"
          className="text-[clamp(28px,6.7vw,44px)] leading-[1.2] font-[450] tracking-[-0.055em] [word-break:keep-all] md:text-[clamp(32px,3.8vw,58px)]"
        >
          <span
            data-hero-reveal="text"
            className={cn(textRevealClassName, "block")}
          >
            {t("headline_lead")}
          </span>
          <span
            data-hero-reveal="text"
            className={cn(textRevealClassName, "block")}
          >
            {t("headline_prefix")}
          </span>
        </h1>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            data-hero-reveal="text"
            href={`/${locale}/archive`}
            className={cn(
              textRevealClassName,
              actionClassName,
              "hover:bg-foreground hover:text-background",
            )}
          >
            {navT("work")} <Infinite size={16} aria-hidden="true" />
          </Link>
          <Link
            data-hero-reveal="text"
            href={`/${locale}/connect`}
            className={cn(
              textRevealClassName,
              actionClassName,
              "bg-foreground text-background hover:border-tertiary hover:bg-tertiary hover:text-white",
            )}
          >
            {t("start_project")} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="relative grid flex-1 grid-cols-2 border-y border-transparent md:grid-cols-[minmax(0,28fr)_minmax(0,44fr)_minmax(0,28fr)]">
        {/* Extend only the rules into the gutters; keep the columns inset. */}
        <span
          data-hero-reveal="grid"
          className={cn(
            gridRevealClassName,
            "pointer-events-none absolute -inset-y-px inset-x-[calc(-1*clamp(20px,4.2vw,72px)-1px)] z-1 border-y border-foreground/17",
          )}
          aria-hidden="true"
        />
        <span
          data-hero-reveal="grid"
          className={cn(dotClassName, "-bottom-[3px] -left-[3px]")}
          aria-hidden="true"
        />
        <span
          data-hero-reveal="grid"
          className={cn(dotClassName, "-right-[3px] -bottom-[3px]")}
          aria-hidden="true"
        />
        <aside className={sideClassName}>
          <p
            data-hero-reveal="text"
            className={cn(textRevealClassName, descriptionClassName)}
          >
            {t("studio_description")}
          </p>
        </aside>
        <div className="relative col-span-full row-start-1 min-h-[clamp(310px,80vw,460px)] min-w-0 border-b border-transparent md:col-span-1 md:row-auto md:min-h-[clamp(340px,48vh,540px)] md:border-x md:border-b-0">
          <HeroBackground />
          <span
            data-hero-reveal="grid"
            aria-hidden="true"
            className={cn(
              gridRevealClassName,
              "pointer-events-none absolute -inset-px z-1 border-b border-foreground/17 md:border-x md:border-b-0",
            )}
          />

          <span
            data-hero-reveal="grid"
            className={cn(dotClassName, "-top-[3px] -left-[3px]")}
            aria-hidden="true"
          />
          <span
            data-hero-reveal="grid"
            className={cn(dotClassName, "-top-[3px] -right-[3px]")}
            aria-hidden="true"
          />
          <span
            data-hero-reveal="grid"
            className={cn(dotClassName, "-bottom-[3px] -left-[3px]")}
            aria-hidden="true"
          />
          <span
            data-hero-reveal="grid"
            className={cn(dotClassName, "-right-[3px] -bottom-[3px]")}
            aria-hidden="true"
          />
        </div>
        <aside
          className={cn(
            sideClassName,
            "relative border-l border-transparent md:border-l-0",
          )}
        >
          <span
            data-hero-reveal="grid"
            aria-hidden="true"
            className={cn(
              gridRevealClassName,
              "pointer-events-none absolute inset-y-0 -left-px border-l border-foreground/17 md:hidden",
            )}
          />
          <p
            data-hero-reveal="text"
            className={cn(textRevealClassName, descriptionClassName)}
          >
            {t("approach_description")}
          </p>
        </aside>
      </div>

      <div
        data-hero-reveal="text"
        className={cn(
          textRevealClassName,
          "flex min-h-24 items-center overflow-hidden py-5",
        )}
      >
        <Marquee speed={42} fadeAmount={8}>
          {marqueePlaceholders.map((name) => (
            <span
              key={name}
              className="flex min-w-48 items-center justify-center px-8 text-sm font-semibold tracking-[0.12em] text-foreground/60 md:min-w-56 md:text-base"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default HeroContent;
