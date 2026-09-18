"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "reicon-react/icons/ArrowRight";
import BookingAppPreview from "@/components/booking-app-preview";
import CommercePreview from "@/components/commerce-preview";
import AiChatPreview from "@/components/ai-chat-preview";
import AutomationWorkflowPreview from "@/components/automation-workflow-preview";
import CrmDashboardPreview from "@/components/crm-dashboard-preview";
import { cn } from "@/lib/utils";

const ideas = [
  { key: "commerce", layout: "lg:col-span-6", visual: "h-80 sm:h-96" },
  { key: "applications", layout: "lg:col-span-6", visual: "h-80 sm:h-96" },
  { key: "crm", layout: "lg:col-span-4", visual: "h-80" },
  { key: "automation", layout: "lg:col-span-4", visual: "h-80" },
  { key: "assistant", layout: "md:col-span-2 lg:col-span-4", visual: "h-80" },
] as const;

type Idea = (typeof ideas)[number]["key"];

function Preview({ kind }: { kind: Idea }) {
  if (kind === "commerce") return <CommercePreview />;
  if (kind === "assistant") return <AiChatPreview />;
  if (kind === "automation") return <AutomationWorkflowPreview />;
  if (kind === "applications") return <BookingAppPreview />;
  return <CrmDashboardPreview />;
}

export default function ManifestoSection() {
  const t = useTranslations("Possibilities");
  const locale = useLocale();
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="possibilities-heading"
      className="relative overflow-hidden bg-background px-[clamp(20px,4.2vw,72px)] py-24 text-foreground md:py-36"
    >
      <div className="w-full">
        <header className="mb-12 flex flex-col justify-between gap-8 lg:mb-16 lg:flex-row lg:items-end">
          <div>
            <h2
              id="possibilities-heading"
              className="mt-5 max-w-3xl whitespace-pre-line text-[clamp(32px,3.2vw,48px)] leading-[1.15] font-medium tracking-[-0.055em] [word-break:keep-all]"
            >
              {t("heading")}
            </h2>
          </div>
        </header>

        <div className="relative grid items-stretch border-x border-foreground/17 md:grid-cols-2 lg:grid-cols-12">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 border-b border-foreground/17"
          />
          {ideas.map(({ key, layout, visual }, index) => (
            <div key={key} className={cn("relative min-w-0", layout)}>
              {/* Overlay dividers so borders do not inset the junction marks. */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-px bg-foreground/17",
                  (index === 0 || index === 2) && "md:block",
                  index === 3 && "lg:block",
                )}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 border-t border-foreground/17"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 text-foreground/40"
              >
                <span className="absolute top-0 left-0 size-3.5 border-t border-l border-current" />
                <span className="absolute top-0 right-0 size-3.5 border-t border-r border-current" />
                <span className="absolute bottom-0 left-0 size-3.5 border-b border-l border-current" />
                <span className="absolute right-0 bottom-0 size-3.5 border-r border-b border-current" />
              </div>
              <article className="relative z-0 isolate h-full overflow-hidden text-foreground">
                <motion.div
                  className={key === "crm" ? "flex h-full flex-col" : undefined}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    aria-hidden={key === "automation" ? undefined : true}
                    className={cn(
                      "pointer-events-none overflow-hidden select-none",
                      visual,
                      key === "crm" && "order-last mt-auto shrink-0",
                    )}
                  >
                    <Preview kind={key} />
                  </div>
                  <div className="relative px-7 pt-8 pb-12 md:px-10 md:pt-10 md:pb-14">
                    <h3 className="text-xl leading-snug font-black tracking-[-0.025em] [word-break:keep-all] sm:text-2xl">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground [word-break:keep-all]">
                      {t(`${key}.description`)}
                    </p>
                  </div>
                </motion.div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
