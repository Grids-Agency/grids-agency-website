"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import Cloud from "reicon-react/icons/Cloud";
import ShieldCheck from "reicon-react/icons/ShieldCheck";

/** An exploded interface study: shared modules assembling across two formats. */
export default function ApplicationSystemPreview() {
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let sequence: gsap.core.Timeline;
    const context = gsap.context(() => {
      sequence = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6 });
      sequence
        .set("[data-system-back]", { attr: { transform: "translate(0 8)" }, opacity: 0.25 })
        .set("[data-system-middle]", { attr: { transform: "translate(0 4)" }, opacity: 0.4 })
        .set("[data-system-module]", { attr: { transform: "translate(0 -12)" }, opacity: 0 })
        .set("[data-system-compact-module]", { attr: { transform: "translate(0 -12)" }, opacity: 0 })
        .set("[data-system-trace]", { opacity: 0, attr: { "stroke-dashoffset": 1 } })
        .set("[data-system-service]", { opacity: 0.45 })
        .set("[data-system-link]", { opacity: 0, attr: { "stroke-dashoffset": 1 } })
        .to("[data-system-back]", { attr: { transform: "translate(0 44)" }, opacity: 0.5, duration: 1.6, ease: "power3.inOut" }, 0.4)
        .to("[data-system-middle]", { attr: { transform: "translate(0 22)" }, opacity: 0.7, duration: 1.6, ease: "power3.inOut" }, 0.6)
        .to("[data-system-module]", { attr: { transform: "translate(0 0)" }, opacity: 1, duration: 1, stagger: 0.13, ease: "power3.out" }, 1)
        .to("[data-system-compact-module]", { attr: { transform: "translate(0 0)" }, opacity: 1, duration: 1, stagger: 0.13, ease: "power3.out" }, 1)
        .to("[data-system-trace]", { opacity: 1, duration: 0.2 }, 2.8)
        .to("[data-system-trace]", { attr: { "stroke-dashoffset": 0 }, duration: 1.2, ease: "power2.inOut" }, 2.8)
        .to("[data-system-service]", { opacity: 1, duration: 0.9, stagger: 0.2, ease: "power2.inOut" }, 2.6)
        .to("[data-system-link]", { opacity: 1, attr: { "stroke-dashoffset": 0 }, duration: 1.1, stagger: 0.2, ease: "power2.inOut" }, 3.1)
        .to("[data-system-trace]", { opacity: 0.35, duration: 1 }, 4.7)
        .to("[data-system-compact-module]", { attr: { transform: "translate(0 -12)" }, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power2.inOut" }, 7.3)
        .to("[data-system-module]", { attr: { transform: "translate(0 -12)" }, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power2.inOut" }, 7.3)
        .to("[data-system-trace]", { opacity: 0, duration: 0.5 }, 7.3)
        .to("[data-system-link]", { opacity: 0, duration: 0.5 }, 6.9)
        .to("[data-system-service]", { opacity: 0.45, duration: 0.8 }, 7)
        .to("[data-system-back]", { attr: { transform: "translate(0 8)" }, opacity: 0.25, duration: 1.2, ease: "power3.inOut" }, 7.7)
        .to("[data-system-middle]", { attr: { transform: "translate(0 4)" }, opacity: 0.4, duration: 1.2, ease: "power3.inOut" }, 7.7)
        .set("[data-system-trace]", { opacity: 0, attr: { "stroke-dashoffset": 1 } }, 8.9);
    }, element);
    const syncPlayback = () => {
      if (media.matches) sequence.pause(5.8);
      else if (visible && !document.hidden) sequence.play();
      else sequence.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.2 });
    observer.observe(element);
    media.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      context.revert();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="flex h-full items-center justify-center text-foreground">
      <svg viewBox="0 0 600 340" className="h-full w-[110%] max-w-none shrink-0 md:w-full md:max-w-[640px]" fill="none">
        <defs>
          <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="currentColor" opacity="0.14" />
          </pattern>
          <radialGradient id={`${id}-fade`}>
            <stop offset="0.3" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </radialGradient>
          <mask id={`${id}-field`}>
            <rect width="600" height="340" fill={`url(#${id}-fade)`} />
          </mask>
        </defs>
        <rect width="600" height="340" fill={`url(#${id}-dots)`} mask={`url(#${id}-field)`} />
        <g stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 5">
          <path d="m40 231 329-85M208 318 329 30" />
        </g>
        {/* Service connections sit behind the planes and draw in after assembly. */}
        <g className="stroke-foreground/30" strokeWidth="1" strokeLinecap="round">
          <path data-system-link opacity="0" d="M246 84V146" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
          <path data-system-link opacity="0" d="M462 84V135" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
          <path data-system-link opacity="0" d="M138 84V174" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
          <path data-system-link opacity="0" d="M354 84V169" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        </g>
        <g transform="translate(210 12)">
          <g data-system-service opacity="0.45">
            <rect width="72" height="72" className="fill-background stroke-foreground/15" />
            <image href="/icons/integrations/stripe.svg" x="17" y="10" width="38" height="30" />
            <text x="36" y="57" textAnchor="middle" className="fill-foreground/70 text-[10px] font-medium tracking-wide">Payments</text>
          </g>
        </g>
        <g transform="translate(426 12)">
          <g data-system-service opacity="0.45">
            <rect width="72" height="72" className="fill-background stroke-foreground/15" />
            <image href="/icons/integrations/app-store.svg" x="22" y="11" width="28" height="28" />
            <text x="36" y="57" textAnchor="middle" className="fill-foreground/70 text-[10px] font-medium tracking-wide">App Store</text>
          </g>
        </g>
        <g transform="translate(102 12)">
          <g data-system-service opacity="0.45">
            <rect width="72" height="72" className="fill-background stroke-foreground/15" />
            <Cloud x="21" y="10" size={30} className="text-foreground/70" />
            <text x="36" y="57" textAnchor="middle" className="fill-foreground/70 text-[10px] font-medium tracking-wide">Cloud</text>
          </g>
        </g>
        <g transform="translate(318 12)">
          <g data-system-service opacity="0.45">
            <rect width="72" height="72" className="fill-background stroke-foreground/15" />
            <ShieldCheck x="22" y="11" size={28} className="text-foreground/70" />
            <text x="36" y="57" textAnchor="middle" className="fill-foreground/70 text-[10px] font-medium tracking-wide">Security</text>
          </g>
        </g>
        {/* All planes share the same projection; only their separation changes. */}
        <g transform="translate(54 195)">
          <g data-system-back opacity="0.25" transform="translate(0 8)">
            <g transform="matrix(.92 -.24 .5 .48 0 0)">
              <rect width="280" height="180" className="fill-background stroke-foreground/25" />
              <path d="M0 60H280M0 120H280M70 0V180M140 0V180M210 0V180" className="stroke-foreground/10" />
              <path d="M0 16V0H16M264 0H280V16M280 164V180H264M16 180H0V164" className="stroke-foreground/50" strokeWidth="1.5" />
            </g>
          </g>
          <g data-system-middle opacity="0.4" transform="translate(0 4)">
            <g transform="matrix(.92 -.24 .5 .48 0 0)">
              <rect width="280" height="180" className="fill-background stroke-foreground/30" />
              <path d="M0 32H280M104 32V180" className="stroke-foreground/15" />
              <rect x="16" y="49" width="72" height="115" className="stroke-foreground/15" />
              <rect x="120" y="49" width="144" height="48" className="stroke-foreground/15" />
              <path d="M120 113H264M120 131H240M120 149H252" className="stroke-foreground/10" />
            </g>
          </g>
          <g transform="matrix(.92 -.24 .5 .48 0 0)">
            <path d="M0 180v4H280v-4" className="fill-foreground/10 stroke-foreground/15" />
            <rect width="280" height="180" className="fill-background stroke-foreground/35" />
            <path d="M0 32H280" className="stroke-foreground/15" />
            <path d="M16 16H64" className="stroke-foreground/45" strokeWidth="3" />
            <path d="M225 16H239M246 16H264" className="stroke-foreground/20" strokeWidth="2" />
            <g data-system-module opacity="0">
              <rect x="16" y="49" width="88" height="115" className="fill-foreground/[0.035] stroke-foreground/15" />
              <rect x="29" y="63" width="62" height="59" className="fill-foreground/10" />
              <path d="M29 138H78M29 149H62" className="stroke-foreground/25" strokeWidth="3" />
            </g>
            <g data-system-module opacity="0">
              <rect x="120" y="49" width="144" height="48" className="fill-foreground/[0.025] stroke-foreground/15" />
              <rect x="132" y="60" width="24" height="24" className="fill-foreground/10" />
              <path d="M169 66H247M169 79H221" className="stroke-foreground/25" strokeWidth="3" />
            </g>
            <g data-system-module opacity="0">
              <rect x="120" y="113" width="64" height="51" className="fill-foreground/[0.035] stroke-foreground/15" />
              <path d="M132 128H158M132 148H173" className="stroke-foreground/25" strokeWidth="3" />
            </g>
            <g data-system-module opacity="0">
              <rect x="200" y="113" width="64" height="51" className="fill-foreground/[0.035] stroke-foreground/15" />
              <path d="M212 128H238M212 148H252" className="stroke-foreground/25" strokeWidth="3" />
            </g>
            <path data-system-trace opacity="0" d="M16 164V49H104V164H16" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="stroke-tertiary/60" strokeWidth="1.5" />
          </g>
        </g>
        {/* A compact format is composed from the same modules, without a device mockup. */}
        <g data-system-compact opacity="1">
          <g transform="matrix(.92 -.24 .5 .48 397 151)">
            <path d="M0 180v4H88v-4" className="fill-foreground/10 stroke-foreground/15" />
            <rect width="88" height="180" className="fill-background stroke-foreground/35" />
            <path d="M0 24H88M12 12H40M66 12H76" className="stroke-foreground/25" />
            <g data-system-compact-module opacity="0">
              <rect x="12" y="36" width="64" height="61" className="fill-foreground/[0.035] stroke-foreground/15" />
              <rect x="22" y="45" width="44" height="31" className="fill-foreground/10" />
              <path d="M22 86H53" className="stroke-foreground/25" strokeWidth="2.5" />
            </g>
            <g data-system-compact-module opacity="0">
              <rect x="12" y="109" width="64" height="22" className="fill-foreground/[0.035] stroke-foreground/15" />
              <path d="M23 120H62" className="stroke-foreground/25" strokeWidth="2.5" />
            </g>
            <g data-system-compact-module opacity="0">
              <rect x="12" y="143" width="26" height="25" className="fill-foreground/[0.035] stroke-foreground/15" />
              <rect x="50" y="143" width="26" height="25" className="fill-foreground/[0.035] stroke-foreground/15" />
            </g>
            <path data-system-trace opacity="0" d="M12 97V36H76V97H12" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="stroke-tertiary/60" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
