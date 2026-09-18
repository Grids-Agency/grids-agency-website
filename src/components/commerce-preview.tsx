"use client";

import MorphSlider from "@/components/MorphSlider";

const storefronts = [
  { image: "/images/commerce/forme.webp" },
  { image: "/images/commerce/still.webp" },
  { image: "/images/commerce/atelier.webp" },
];

export default function CommercePreview() {
  return (
    <div className="flex h-full items-center justify-center px-7 py-6 md:px-10">
      <div className="h-full w-full overflow-hidden bg-background">
        <MorphSlider items={storefronts} autoplayDelay={4} duration={1.2} />
      </div>
    </div>
  );
}
