"use client";

import { useCallback, useRef, useState } from "react";
import Intro from "@/components/intro";
import ProcessSection from "@/components/process-section";
import StudioIntroduction from "@/components/studio-introduction";
import AboutSection from "@/components/about-section";
import HeroContent from "@/components/hero-content";
import HeroGridBackground from "@/components/hero-grid-background";
import Navbar from "@/components/navbar";
import ManifestoSection from "@/components/manifesto-section";

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const revealContent = useCallback(() => setRevealed(true), []);

  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground">
      <Intro contentRef={heroRef} onReveal={revealContent} />

      <div
        ref={heroRef}
        data-hero-pending={!revealed}
        inert={!revealed}
        className="group/hero relative flow-root"
      >
        {/* Keep the fixed navbar outside the hero's sticky stacking context. */}
        <Navbar inHero />
        {/* The introduction and About scroll over the stationary hero. */}
        <div className="sticky top-0 min-h-screen bg-background motion-reduce:relative">
          <HeroGridBackground />
          <HeroContent />
        </div>

        <div
          id="about"
          className="relative z-10 flex flex-col scroll-mt-6 bg-background"
        >
          <StudioIntroduction />
          <AboutSection />
          <ManifestoSection />
          <ProcessSection />
        </div>
      </div>
    </main>
  );
}
