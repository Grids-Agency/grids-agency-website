"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import spinners from "unicode-animations";
import FallbackAvatar from "@/components/fallback-avatar";

export default function AiChatPreview() {
  const t = useTranslations("Possibilities.assistant");
  const question = t("question");
  const answer = t("answer");
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const spinner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    const field = input.current;
    const spinnerElement = spinner.current;
    if (!element || !field || !spinnerElement) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bounds = element.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    let sequence: gsap.core.Timeline;
    const context = gsap.context(() => {
      const letters = Array.from(question);
      const typing = { count: 0 };
      const loading = { frame: 0 };
      const updateSpinner = () => {
        spinnerElement.textContent = spinners.orbit.frames[Math.floor(loading.frame) % spinners.orbit.frames.length];
      };
      const updateQuestion = () => { field.value = letters.slice(0, Math.floor(typing.count)).join(""); };
      sequence = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6 });
      sequence
        .set(typing, { count: 0, onUpdate: updateQuestion })
        .set(loading, { frame: 0, onUpdate: updateSpinner })
        .set("[data-chat-loader]", { autoAlpha: 0 })
        .set(field, { opacity: 1 })
        .set("[data-chat-question]", { autoAlpha: 0, y: 6 })
        .set("[data-chat-reply]", { autoAlpha: 0, y: 6, filter: "blur(4px)" })
        .set("[data-chat-answer]", { opacity: 0 })
        .set("[data-chat-source], [data-chat-sent]", { autoAlpha: 0 })
        .set("[data-chat-arrow]", { opacity: 1 })
        .set("[data-chat-send]", { opacity: 0.35, scale: 1 })
        .to(typing, { count: letters.length, duration: 1.6, ease: "none", onUpdate: updateQuestion }, 0.5)
        .to("[data-chat-send]", { opacity: 1, duration: 0.2 }, 2.1)
        .to("[data-chat-send]", { scale: 0.9, duration: 0.12, repeat: 1, yoyo: true }, 2.4)
        .to("[data-chat-arrow]", { opacity: 0, duration: 0.15 }, 2.6)
        .to("[data-chat-sent]", { autoAlpha: 1, duration: 0.15 }, 2.6)
        .to("[data-chat-question]", { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 2.8)
        .to("[data-chat-loader]", { autoAlpha: 1, duration: 0.15 }, 2.8)
        .to(loading, { frame: 2000 / spinners.orbit.interval, duration: 2, ease: "none", onUpdate: updateSpinner }, 2.8)
        .set(typing, { count: 0, onUpdate: updateQuestion }, 3.1)
        .to("[data-chat-sent]", { autoAlpha: 0, duration: 0.15 }, 3.1)
        .to("[data-chat-arrow]", { opacity: 1, duration: 0.15 }, 3.1)
        .to("[data-chat-send]", { opacity: 0.35, duration: 0.15 }, 3.1)
        .to("[data-chat-loader]", { autoAlpha: 0, duration: 0.15 }, 4.85)
        .to("[data-chat-reply]", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, 5.1)
        .to("[data-chat-answer]", { opacity: 1, duration: 0, stagger: { amount: 1.8 } }, 5.3)
        .to("[data-chat-source]", { autoAlpha: 1, duration: 0.3 }, 7.3)
        .to("[data-chat-question], [data-chat-reply]", { autoAlpha: 0, duration: 0.4 }, 11.1);
    }, element);
    const syncPlayback = () => {
      if (media.matches) sequence.pause(8);
      else if (visible && !document.hidden) sequence.play();
      else sequence.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
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
  }, [question, answer]);

  return (
    <div ref={root} aria-hidden="true" className="mx-auto flex h-full w-full max-w-md flex-col gap-3 px-6 py-5 text-foreground">
      <p data-chat-question className="invisible max-w-[90%] self-end rounded-lg bg-foreground/5 px-3 py-2 text-[11px] leading-relaxed opacity-0 [word-break:keep-all]">{question}</p>
      <div className="relative">
        <div data-chat-loader className="invisible absolute top-0 left-1 flex items-center gap-2 text-[10px] text-muted-foreground opacity-0">
          <span ref={spinner} data-chat-orbit className="inline-block w-4 font-mono text-xl leading-6">{spinners.orbit.frames[0]}</span>
          <span>{t("thinking")}</span>
        </div>
        <div data-chat-reply className="invisible flex items-start gap-3 px-1 opacity-0">
          <FallbackAvatar name="GRIDS AI" size={24} animated={false} className="mt-0.5 shrink-0 bg-linear-to-br from-foreground/10 to-foreground/30" />
          <div className="min-w-0">
            <p className="text-[11px] leading-[1.8] [word-break:keep-all]">{Array.from(answer).map((letter, index) => <span key={index} data-chat-answer className="opacity-0">{letter}</span>)}</p>
            <div data-chat-source className="invisible mt-3 flex items-center gap-1.5 text-[8px] text-muted-foreground opacity-0"><svg width="10" height="11" viewBox="0 0 12 14" className="shrink-0" fill="none" stroke="currentColor" strokeWidth="1"><path d="M2 1h5l3 3v9H2ZM7 1v4h3M4 8h4M4 10h3" /></svg>{t("source")}</div>
          </div>
        </div>
      </div>
      <div className="mt-auto flex shrink-0 items-center gap-3 rounded-lg border border-foreground/15 bg-foreground/[0.025] py-3 pr-3 pl-4">
        <textarea ref={input} data-chat-input readOnly tabIndex={-1} rows={2} defaultValue="" placeholder={t("placeholder")} className="block h-9 min-w-0 flex-1 resize-none overflow-hidden border-0 bg-transparent p-0 text-[11px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground [word-break:keep-all]" />
        <div data-chat-send className="relative flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background opacity-35">
          <svg data-chat-arrow width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
          <svg data-chat-sent width="14" height="14" viewBox="0 0 16 16" className="invisible absolute opacity-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3.5 8 3 3 6-6" /></svg>
        </div>
      </div>
    </div>
  );
}
