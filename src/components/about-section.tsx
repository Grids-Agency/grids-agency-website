"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "reicon-react/icons/ArrowRight";
import BrandLogo from "@/components/brand-logo";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  className?: string;
}

function PanelOutline() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute inset-1 border border-foreground/[0.08]" />
      <span className="absolute top-0 left-0 size-5 border-t-2 border-l-2 border-foreground/25" />
      <span className="absolute top-0 right-0 size-5 border-t-2 border-r-2 border-foreground/25" />
      <span className="absolute bottom-0 left-0 size-5 border-b-2 border-l-2 border-foreground/25" />
      <span className="absolute right-0 bottom-0 size-5 border-r-2 border-b-2 border-foreground/25" />
    </div>
  );
}

export default function AboutSection({ className }: AboutSectionProps) {
  const t = useTranslations("About.layout");
  const locale = useLocale();
  const brandRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const letters = brandRef.current?.querySelectorAll("[data-brand-letter]");
    return () => {
      if (letters) gsap.killTweensOf(letters);
    };
  }, []);

  const animateBrand = (active: boolean) => {
    const brand = brandRef.current;
    if (!brand) return;
    const letters = brand.querySelectorAll("[data-brand-letter]");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    gsap.to(letters, {
      y: active && !reducedMotion ? "-15%" : "0%",
      color: active ? "var(--tertiary)" : getComputedStyle(brand).color,
      stagger: reducedMotion ? 0 : { each: 0.03, from: "center" },
      duration: reducedMotion ? 0 : 0.4,
      ease: active ? "back.out(2)" : "power2.out",
      overwrite: "auto",
      onComplete: () => {
        if (!active) gsap.set(letters, { clearProps: "color,transform" });
      },
    });
  };

  const panels = [
    { key: "design", number: "01", href: `/${locale}/archive` },
    { key: "ai", number: "02", href: `/${locale}/connect` },
  ] as const;

  return (
    <section
      id="about-details"
      aria-labelledby="about-heading"
      className={cn(
        "relative w-full scroll-mt-24 bg-background px-[clamp(20px,4.2vw,72px)] py-8 text-foreground md:py-16",
        className,
      )}
    >
      <h2
        ref={brandRef}
        aria-label="GRIDS AGENCY"
        onMouseEnter={() => animateBrand(true)}
        onMouseLeave={() => animateBrand(false)}
        className="cursor-default py-8 text-center text-[12vw] leading-[0.8] font-black tracking-tighter whitespace-nowrap text-foreground/80 select-none md:mb-8"
      >
        <span aria-hidden="true">
          {"GRIDS AGENCY".split("").map((letter, index) => (
            <span
              key={index}
              data-brand-letter
              className="relative inline-block"
            >
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </span>
      </h2>
      <div>
        <div className="grid items-center gap-10 px-6 py-10 md:grid-cols-[1.3fr_1fr] md:gap-16 md:px-12 md:py-14 lg:px-16 lg:py-16">
          <div className="max-w-lg">
            <span className="text-sm font-mono text-tertiary tracking-wider uppercase">our services</span>
            <h2 id="about-heading" className="mt-2 max-w-[13em] text-3xl leading-[1.15] font-medium tracking-[-0.045em] [word-break:keep-all] md:text-[clamp(32px,3.2vw,48px)]">
              {t("heading")}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground [word-break:keep-all] md:text-base">{t("description")}</p>
          </div>
          <div className="relative flex min-h-48 flex-col justify-between gap-12 overflow-hidden bg-[#c56e50] p-6 text-white md:min-h-52 lg:aspect-[2/1] lg:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,#eed6a5_0%,transparent_60%),radial-gradient(ellipse_at_5%_95%,#f5b2a2_0%,transparent_65%),linear-gradient(125deg,#943d53,#e87958_55%,#f6bd9e)]" />
            <p className="relative max-w-xs text-sm leading-relaxed [word-break:keep-all] md:text-base">{t("feature")}</p>
            <div className="relative flex items-center justify-end gap-2.5">
              <BrandLogo className="size-6 bg-white" />
              <span className="text-xl font-medium tracking-[-0.04em]">GRIDS AGENCY</span>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {panels.map(({ key, number, href }) => (
            <article key={key} className="relative flex min-w-0 flex-col p-6 md:p-8 lg:p-10">
              <PanelOutline />
              <h3 className="text-xl font-medium tracking-[-0.035em] md:text-2xl">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground [word-break:keep-all] md:min-h-12 md:text-base">{t(`${key}.description`)}</p>
              <div className="relative mt-5 flex aspect-[1.6/1] items-center justify-center overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.015]">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(var(--foreground)_0.6px,transparent_0.6px)] bg-size-[12px_12px] opacity-[0.08]" />
                <span aria-hidden="true" className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-muted-foreground/60">{number}</span>
                <div className="relative flex flex-col items-center gap-3 text-muted-foreground/60">
                  <BrandLogo className="size-9 opacity-30" />
                  <span className="text-xs tracking-wide">{t("visualPlaceholder")}</span>
                </div>
              </div>
              <Link href={href} className="mt-6 inline-flex min-h-10 items-center gap-3 self-start bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-tertiary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary">
                {t("learnMore")} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
