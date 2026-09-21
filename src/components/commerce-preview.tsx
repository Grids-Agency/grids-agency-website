"use client";

import { useTranslations } from "next-intl";
import { ImageSlider, ImageLayer, Divider } from "@/components/ui/image-comparison";
import ChevronLeft from "reicon-react/icons/ChevronLeft";
import ChevronRight from "reicon-react/icons/ChevronRight";

export default function CommercePreview() {
  const t = useTranslations("Possibilities.commerce.comparison");

  return (
    <div className="pointer-events-auto relative h-full w-full overflow-hidden">
      <ImageSlider
        className="absolute inset-0"
        ariaLabel={`${t("label")}. ${t("instruction")}`}
        valueText={position => `${t("before")} ${position}%, ${t("after")} ${100 - position}%`}
        defaultPosition={50}
      >
        <ImageLayer src="/images/commerce/comparison-after.webp" alt="" layer="first" label={t("after")} softenBottomEdge className="object-contain object-top lg:object-cover" />
        <ImageLayer src="/images/commerce/comparison-before.webp" alt="" layer="second" label={t("before")} softenBottomEdge className="object-contain object-top lg:object-cover" />
        <Divider
          lineClassName="[mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
          width={1}
          handleSize={44}
          hitAreaSize={32}
          handleColor="#ffffff"
          handleIcon={<span className="flex items-center text-[#292929]"><ChevronLeft size={14} /><ChevronRight size={14} /></span>}
        />
      </ImageSlider>
    </div>
  );
}
