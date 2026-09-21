// Lock only while the loading overlay is visible; repeated cleanup is safe.
export function lockIntroScroll() {
  const root = document.documentElement;
  const body = document.body;
  const restoration = window.history.scrollRestoration;
  const rootOverflow = root.style.overflow;
  const rootBehavior = root.style.scrollBehavior;
  const rootGutter = root.style.scrollbarGutter;
  const bodyOverflow = body.style.overflow;

  window.history.scrollRestoration = "manual";
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  root.style.scrollbarGutter = "stable";
  root.style.overflow = "hidden";
  body.style.overflow = "hidden";

  const preventScroll = (event: Event) => event.preventDefault();
  const preventScrollKey = (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key)) event.preventDefault();
  };
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventScrollKey);

  let released = false;
  return () => {
    if (released) return;
    released = true;
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("keydown", preventScrollKey);
    body.style.overflow = bodyOverflow;
    root.style.overflow = rootOverflow;
    root.style.scrollbarGutter = rootGutter;
    root.style.scrollBehavior = rootBehavior;
    window.history.scrollRestoration = restoration;
  };
}
