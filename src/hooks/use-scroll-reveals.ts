"use client";

import { useLayoutEffect, type RefObject } from "react";

/** Enhance visible markup without hiding content before hydration or adding layout wrappers. */
export function useScrollReveals(root: RefObject<HTMLElement | null>, enabled = true) {
  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope || !enabled || !window.IntersectionObserver || !Element.prototype.animate) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const pending = new Map<HTMLElement, string>();
    const running = new Map<HTMLElement, Animation>();
    const reveal = (element: HTMLElement, delay = 0) => {
      if (!pending.has(element)) return;
      const opacity = pending.get(element)!;
      pending.delete(element);
      observer.unobserve(element);
      element.style.opacity = opacity;
      const kind = element.dataset.scrollReveal;
      const from: Keyframe = { opacity: 0 };
      const to: Keyframe = { opacity: 1 };
      if (kind === "text") { from.filter = "blur(5px)"; to.filter = "blur(0px)"; }
      if (kind === "surface" || kind === "text") { from.transform = `translateY(${kind === "text" ? 10 : 18}px)`; to.transform = "translateY(0)"; }
      if (kind === "line-x" || kind === "line-y") {
        from.clipPath = kind === "line-x" ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)";
        to.clipPath = "inset(0 0 0 0)";
      }
      const animation = element.animate([from, to], {
        duration: kind?.startsWith("line") ? 1000 : 850,
        delay: delay + Math.min(1000, Math.max(0, Number(element.dataset.revealDelay) || 0)), easing: "cubic-bezier(0.22,1,0.36,1)", fill: "both",
      });
      running.set(element, animation);
      animation.onfinish = () => { animation.cancel(); running.delete(element); };
    };
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        reveal(entry.target as HTMLElement, Math.min(index * 45, 180));
      });
    }, { rootMargin: "0px", threshold: 0 });
    scope.querySelectorAll<HTMLElement>("[data-scroll-reveal]").forEach(element => {
      pending.set(element, element.style.opacity);
      element.style.opacity = "0";
      observer.observe(element);
    });
    // Keyboard navigation must never land on an invisible link or control.
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const element of pending.keys()) if (element.contains(event.target)) reveal(element);
      for (const [element, animation] of running) if (element.contains(event.target)) animation.finish();
    };
    const clear = () => {
      observer.disconnect();
      pending.forEach((opacity, element) => { element.style.opacity = opacity; });
      pending.clear();
      running.forEach(animation => animation.cancel());
      running.clear();
    };
    const onPreference = () => { if (media.matches) clear(); };
    media.addEventListener("change", onPreference);
    scope.addEventListener("focusin", onFocus);
    return () => {
      clear();
      media.removeEventListener("change", onPreference);
      scope.removeEventListener("focusin", onFocus);
    };
  }, [root, enabled]);
}
