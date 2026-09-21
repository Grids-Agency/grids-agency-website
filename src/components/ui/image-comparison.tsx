"use client";

import { cn } from "@/lib/utils";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useRef,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimationOptions,
} from "motion/react";

const SliderContext = createContext<
  | {
      position: number;
      setPosition: (pos: number) => void;
      motionPosition: MotionValue<number>;
      orientation: "horizontal" | "vertical";
      isDragging: boolean;
      contentDimensions: { width: number; height: number } | null;
    }
  | undefined
>(undefined);

export type ContrastSliderProps = {
  children: React.ReactNode;
  className?: string;
  hoverControl?: boolean;
  orientation?: "horizontal" | "vertical";
  defaultPosition?: number;
  animationConfig?: Partial<AnimationOptions>;
  dividerColor?: string;
  constrainToContent?: boolean;
  ariaLabel?: string;
  valueText?: (position: number) => string;
};

const DEFAULT_ANIMATION_CONFIG = {
  damping: 15,
  stiffness: 400,
  mass: 0.4,
};

function ImageSlider({
  children,
  className,
  hoverControl = false,
  orientation = "horizontal",
  defaultPosition = 50,
  animationConfig,
  dividerColor,
  constrainToContent = false,
  ariaLabel = "Image comparison slider",
  valueText,
}: ContrastSliderProps) {
  const [isActive, setIsActive] = useState(false);
  const baseMotion = useMotionValue(defaultPosition);
  const springMotion = useSpring(
    baseMotion,
    animationConfig ?? DEFAULT_ANIMATION_CONFIG,
  );
  const [position, setPosition] = useState(defaultPosition);
  const [contentDimensions, setContentDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const activePointer = useRef<number | null>(null);
  const motionToUse = hoverControl || reducedMotion ? baseMotion : springMotion;

  useEffect(() => {
    if (!constrainToContent) return;
    const container = containerRef.current;
    const image = container?.querySelector("img");
    const parent = container?.parentElement;
    if (!container || !image || !parent) return;
    const updateDimensions = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      const scale = Math.min(1, parent.clientWidth / image.naturalWidth, parent.clientHeight / image.naturalHeight);
      setContentDimensions({ width: image.naturalWidth * scale, height: image.naturalHeight * scale });
    };
    image.addEventListener("load", updateDimensions);
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(parent);
    return () => {
      image.removeEventListener("load", updateDimensions);
      observer.disconnect();
    };
  }, [constrainToContent]);

  const updatePosition = (value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    baseMotion.set(clamped);
    setPosition(clamped);
  };
  const handleInteraction = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const extent = orientation === "horizontal" ? bounds.width : bounds.height;
    if (!extent) return;
    const offset = orientation === "horizontal" ? event.clientX - bounds.left : event.clientY - bounds.top;
    updatePosition(offset / extent * 100);
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== event.pointerId) return;
    activePointer.current = null;
    setIsActive(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    const changes: Record<string, number> = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step, PageDown: -10, PageUp: 10 };
    if (event.key !== "Home" && event.key !== "End" && !(event.key in changes)) return;
    event.preventDefault();
    updatePosition(event.key === "Home" ? 0 : event.key === "End" ? 100 : position + changes[event.key]);
  };

  return (
    <SliderContext.Provider
      value={{
        position,
        setPosition,
        motionPosition: motionToUse,
        orientation,
        isDragging: isActive || hoverControl,
        contentDimensions,
      }}
    >
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-orientation={orientation}
        aria-valuenow={Math.round(position)}
        aria-valuetext={valueText?.(Math.round(position))}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "relative select-none overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary",
          orientation === "horizontal" ? "touch-pan-y cursor-ew-resize" : "touch-pan-x cursor-ns-resize",
          constrainToContent ? "inline-block" : "w-full h-full",
          hoverControl &&
            (orientation === "horizontal"
              ? "cursor-ew-resize"
              : "cursor-ns-resize"),
          className,
        )}
        onPointerDown={event => {
          if (event.button !== 0 || !event.isPrimary) return;
          activePointer.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.focus({ preventScroll: true });
          setIsActive(true);
          handleInteraction(event);
        }}
        onPointerMove={event => {
          if (activePointer.current === event.pointerId || (hoverControl && event.pointerType === "mouse")) handleInteraction(event);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => { activePointer.current = null; setIsActive(false); }}
        onKeyDown={handleKeyDown}
        style={
          {
            "--divider-color": dividerColor || "#ffffff",
            width: contentDimensions
              ? `${contentDimensions.width}px`
              : undefined,
            height: contentDimensions
              ? `${contentDimensions.height}px`
              : undefined,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          } as React.CSSProperties
        }
      >
        <div
          className="relative overflow-hidden rounded-[inherit]"
          style={{
            width: contentDimensions ? `${contentDimensions.width}px` : "100%",
            height: contentDimensions
              ? `${contentDimensions.height}px`
              : "100%",
          }}
        >
          {children}
        </div>
      </div>
    </SliderContext.Provider>
  );
}

type ImageLayerProps = {
  className?: string;
  alt: string;
  src: string;
  layer: "first" | "second";
  loading?: "lazy" | "eager";
  priority?: boolean;
  label?: string;
};

const ImageLayer = ({
  className,
  alt,
  src,
  layer,
  loading = "eager",
  priority = false,
  label,
}: ImageLayerProps) => {
  const { motionPosition, orientation } = useContext(SliderContext)!;

  const firstLayerClip = useTransform(motionPosition, (value) =>
    orientation === "horizontal"
      ? `inset(0 0 0 ${value}%)`
      : `inset(${value}% 0 0 0)`,
  );

  const secondLayerClip = useTransform(motionPosition, (value) =>
    orientation === "horizontal"
      ? `inset(0 ${100 - value}% 0 0)`
      : `inset(0 0 ${100 - value}% 0)`,
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        clipPath: layer === "first" ? firstLayerClip : secondLayerClip,
        willChange: "clip-path",
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("absolute inset-0 h-full w-full object-contain", className)}
      />
      {label && (
        <span aria-hidden="true" className={cn(
          "absolute bottom-4 border px-3.5 py-2 text-xs font-semibold tracking-[0.04em] shadow-[0_3px_12px_#0003] sm:bottom-5 sm:text-[13px]",
          layer === "second"
            ? "left-4 border-white/20 bg-[#252525] text-white sm:left-5"
            : "right-4 border-black/10 bg-tertiary text-[#171717] sm:right-5",
        )}>{label}</span>
      )}
    </motion.div>
  );
};

type DividerProps = {
  className?: string;
  children?: React.ReactNode;
  width?: number;
  showHandle?: boolean;
  handleSize?: number;
  handleColor?: string;
  handleIcon?: ReactNode;
  hitAreaSize?: number;
};

const Divider = ({
  className,
  children,
  width = 2,
  showHandle = true,
  handleSize = 24,
  handleColor,
  handleIcon,
  hitAreaSize = 20,
}: DividerProps) => {
  const { motionPosition, orientation, isDragging } =
    useContext(SliderContext)!;
  const dividerPosition = useTransform(motionPosition, (value) => `${value}%`);

  return (
    <motion.div
      className={cn(
        "absolute",
        orientation === "horizontal"
          ? `bottom-0 top-0 cursor-ew-resize`
          : `left-0 right-0 cursor-ns-resize`,
        className,
      )}
      style={{
        left: orientation === "horizontal" ? dividerPosition : 0,
        top: orientation === "vertical" ? dividerPosition : 0,
        width: orientation === "horizontal" ? `${width}px` : "100%",
        height: orientation === "vertical" ? `${width}px` : "100%",
        backgroundColor: "var(--divider-color)",
        willChange: "transform, left, top",
        pointerEvents: "all",
        zIndex: 5,
      }}
    >
      <div
        className="absolute bg-transparent"
        style={{
          left: orientation === "horizontal" ? `${-hitAreaSize / 2}px` : 0,
          right: orientation === "horizontal" ? `${-hitAreaSize / 2}px` : 0,
          top: orientation === "vertical" ? `${-hitAreaSize / 2}px` : 0,
          bottom: orientation === "vertical" ? `${-hitAreaSize / 2}px` : 0,
          width:
            orientation === "horizontal" ? `${width + hitAreaSize}px` : "100%",
          height:
            orientation === "vertical" ? `${width + hitAreaSize}px` : "100%",
          cursor: orientation === "horizontal" ? "ew-resize" : "ns-resize",
          zIndex: 10,
        }}
      />

      {showHandle && (
        <div
          className={cn(
            "absolute rounded-full bg-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 motion-reduce:transition-none",
            isDragging && "scale-110",
          )}
          style={{
            width: `${handleSize}px`,
            height: `${handleSize}px`,
            left: orientation === "horizontal" ? "50%" : "50%",
            top: orientation === "vertical" ? "50%" : "50%",
            backgroundColor: handleColor || "var(--divider-color)",
            willChange: "transform",
            zIndex: 20,
          }}
        >
          {handleIcon || children}
        </div>
      )}
    </motion.div>
  );
};

export { ImageSlider, ImageLayer, Divider };
