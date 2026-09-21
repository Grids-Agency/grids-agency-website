"use client";

import { useTranslations } from "next-intl";
import Cube from "@/components/originkit/ui/cube";
import { useSurfaceTheme } from "@/components/spectrumui/use-surface-theme";

const rotation = { x: 1, y: 2, z: 0.3 };
const transition = { type: "spring" as const, stiffness: 80, damping: 18, mass: 1 };

export default function ConsultationButton() {
  const t = useTranslations("ConsultationButton");
  const theme = useSurfaceTheme();

  return (
    <a
      href="http://pf.kakao.com/_FGQrX/chat"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("accessibleLabel")}
      className="group fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 inline-flex min-h-14 items-center gap-2 border border-white/20 bg-[#1b1b1b] py-1 pr-6 pl-1.5 text-white shadow-[0_8px_30px_#0003] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:bg-[#262626] hover:shadow-[0_12px_36px_#0005] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary motion-reduce:transform-none motion-reduce:transition-none md:right-8 md:bottom-8"
    >
      <span aria-hidden="true" className="pointer-events-none size-11 shrink-0">
        <Cube
          color={theme === "dark" ? "#38bdf8" : "#e9620e"}
          cubeGrid={6}
          dotsPerFace={1}
          dotSize={1}
          sizePercent={97}
          rotation={rotation}
          transition={transition}
        />
      </span>
      <span className="text-sm font-bold tracking-tight">{t("label")}</span>
    </a>
  );
}
