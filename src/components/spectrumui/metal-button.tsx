'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { MetalFx, type MetalFxPreset } from 'metal-fx';
import { useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useSurfaceTheme, type SurfaceTheme } from '@/components/spectrumui/use-surface-theme';

export interface MetalButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  /** Render the styled child directly, for example a navigation link. */
  asChild?: boolean;
  /** Metal palette. Default "chromatic" */
  preset?: MetalFxPreset;
  /** "auto" follows a `.dark`/`.light` class on <html>, then the OS. Default "auto" */
  theme?: SurfaceTheme;
  /** Ring intensity 0–1. Default 1 */
  strength?: number;
  /** Pill height and type size. Default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Freeze the shader on its current frame */
  paused?: boolean;
  /** Classes for the inner button */
  className?: string;
  /** Classes for the MetalFx wrapper */
  wrapperClassName?: string;
}

const SIZE = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
} as const;

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function MetalButton({
  asChild = false,
  preset = 'chromatic',
  theme = 'auto',
  strength = 1,
  size = 'md',
  paused = false,
  className,
  wrapperClassName,
  children,
  type = 'button',
  ...props
}: MetalButtonProps) {
  const resolved = useSurfaceTheme(theme);
  const reducedMotion = useReducedMotion();
  const hydrated = React.useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const Component = asChild ? Slot : 'button';
  const wrapperClasses = cn('inline-flex rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-tertiary', wrapperClassName);
  const button = (
      <Component
        type={asChild ? undefined : type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none',
          // metal-fx keeps the host fill transparent so the ring frames the page surface; only the label carries the theme
          'text-neutral-900 hover:opacity-80 active:scale-[0.97] dark:text-white',
          'focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-60',
          SIZE[size],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
  );

  // MetalFx detects WebGL during render, so only mount it after hydration.
  // Keep the actual link/button visible and usable in the server-rendered HTML.
  if (!hydrated) return <div className={wrapperClasses}>{button}</div>;

  return (
    <MetalFx
      variant="button"
      preset={preset}
      theme={resolved}
      strength={strength}
      paused={paused || Boolean(reducedMotion)}
      className={wrapperClasses}
    >
      {button}
    </MetalFx>
  );
}
