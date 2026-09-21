"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface TextLine {
  x: number;
  y: number;
  width: number;
}

function wavePath({ x, y, width }: TextLine) {
  let path = `M ${x} ${y}`;
  // Small, close-set waves keep the underline curly even on narrow screens.
  for (let offset = 0; offset < width; offset += 12) {
    const length = Math.min(12, width - offset);
    const start = x + offset;
    path += ` C ${start + length / 4} ${y - 5}, ${start + length / 4} ${y - 5}, ${start + length / 2} ${y}`;
    path += ` C ${start + length * 3 / 4} ${y + 5}, ${start + length * 3 / 4} ${y + 5}, ${start + length} ${y}`;
  }
  return path;
}

export function SquigglyUnderline({ text }: { text: string }) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<TextLine[]>([]);
  const visible = useInView(wrapperRef, { once: true, amount: 0.7 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = textRef.current;
    if (!wrapper || !content) return;
    let active = true;

    const measure = () => {
      if (!active) return;
      const bounds = wrapper.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(content);
      const next = Array.from(range.getClientRects())
        .filter((rect) => rect.width > 0 && rect.height > 0)
        .map((rect) => ({ x: rect.left - bounds.left, y: rect.bottom - bounds.top + 3, width: rect.width }));
      setLines((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    // Font loading can change line breaks without changing the container width.
    void document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      active = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [text]);

  return (
    <span ref={wrapperRef} className="relative block w-fit max-w-full pb-2">
      <span ref={textRef}>{text}</span>
      <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 size-full overflow-visible text-tertiary" fill="none">
        {lines.map((line, index) => (
          <motion.path
            key={index}
            d={wavePath(line)}
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: visible || reducedMotion ? 1 : 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 1.1, delay: 0.15 + index * 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>
    </span>
  );
}
