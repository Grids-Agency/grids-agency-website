"use client";

import { useTranslations } from "next-intl";
import StudioLanyard from "@/components/studio-lanyard";
import { HighlightedText } from "@/components/highlighted-text";
import { WordsStagger } from "@/components/words-stagger";
import { Signature } from "@/components/signature";

export default function StudioIntroduction() {
  const t = useTranslations("StudioIntroduction");

  return (
    <section
      aria-labelledby="studio-introduction-heading"
      className="relative flex min-h-svh flex-col justify-between gap-8 bg-background px-[clamp(20px,4.2vw,72px)] py-section text-foreground md:gap-10"
    >
      <div className="relative grid flex-1 lg:min-h-[720px] lg:grid-cols-[1fr_1.1fr]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        >
          <span className="absolute top-0 left-0 size-5 border-t-2 border-l-2 border-foreground/25" />
          <span className="absolute top-0 right-0 size-5 border-t-2 border-r-2 border-foreground/25" />
          <span className="absolute bottom-0 left-0 size-5 border-b-2 border-l-2 border-foreground/25" />
          <span className="absolute bottom-0 right-0 size-5 border-b-2 border-r-2 border-foreground/25" />
        </div>
        <div className="flex min-w-0 flex-col justify-center px-6 py-12 md:px-10 lg:py-16">
          <h2
            id="studio-introduction-heading"
            aria-label={`${t("lineOne")} ${t("lineTwo")} ${t("lineThree")}`}
            className="text-[clamp(30px,3.4vw,58px)] leading-[1.3] font-medium tracking-[-0.055em] [word-break:keep-all]"
          >
            <span
              aria-hidden="true"
              className="flex flex-col items-start gap-1 md:gap-2"
            >
              <WordsStagger inView stagger={0.06} speed={0.65}>
                {t("lineOne")}
              </WordsStagger>
              <HighlightedText
                inView
                from="left"
                delay={0.4}
                className="-ml-[0.15em]"
              >
                <WordsStagger inView delay={0.12} stagger={0.06} speed={0.65}>
                  {t("lineTwo")}
                </WordsStagger>
              </HighlightedText>
              <WordsStagger inView delay={0.25} stagger={0.06} speed={0.65}>
                {t("lineThree")}
              </WordsStagger>
            </span>
          </h2>

          <div className="mt-10 flex flex-col gap-6 md:mt-12">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-48 items-center">
                <Signature
                  text="KYLE"
                  color="currentColor"
                  fontSize={64}
                  duration={1.2}
                  inView
                  className="h-20 w-auto max-w-full text-foreground"
                />
              </div>
              <span className="border-l border-foreground/15 pl-5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                CEO / GRIDS AGENCY
              </span>
            </div>
            <p className="max-w-xl text-base leading-[1.9] text-muted-foreground [word-break:keep-all] md:text-lg">
              {t.rich("description", {
                highlight: (chunks) => (
                  <HighlightedText
                    inView
                    from="left"
                    delay={0.25}
                    className="align-middle font-medium"
                  >
                    {chunks}
                  </HighlightedText>
                ),
              })}
            </p>
          </div>
        </div>
        <div className="relative min-w-0 lg:static">
          <div className="relative z-20 h-[520px] sm:h-[640px] lg:absolute lg:inset-0 lg:h-auto">
            <StudioLanyard />
          </div>
          <p className="pointer-events-none absolute right-0 bottom-12 left-0 z-30 text-center font-mono text-[10px] tracking-[0.12em] text-muted-foreground lg:left-[47.619%]">
            {t("lanyardHint")}
          </p>
        </div>
      </div>
    </section>
  );
}
