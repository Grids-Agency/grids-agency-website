"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MetalButton } from "@/components/spectrumui/metal-button";

export default function ConsultationButton() {
  const t = useTranslations("ConsultationButton");
  const reduced = useReducedMotion();

  return (
    <div className="fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 md:right-8 md:bottom-8">
      <MetalButton
        asChild
        className="group min-h-14 gap-3 rounded-none px-5 text-sm font-bold tracking-tight"
        wrapperClassName="rounded-none"
      >
        <a
          href="http://pf.kakao.com/_FGQrX"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("accessibleLabel")}
        >
          <span aria-hidden="true" className="pointer-events-none flex size-8 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transform-none">
            <motion.span
              className="block size-7 origin-bottom"
              animate={reduced ? { y: 0, rotate: 0 } : { y: [0, -3, -1, 0], rotate: [0, -7, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
            >
              <Image src="/icons/integrations/kakao-bubble.png" alt="" width={28} height={27} className="h-auto w-7 dark:invert" />
            </motion.span>
          </span>
          <span>{t("label")}</span>
        </a>
      </MetalButton>
    </div>
  );
}
