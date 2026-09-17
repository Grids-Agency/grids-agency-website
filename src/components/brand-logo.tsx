import { cn } from "@/lib/utils";

export default function BrandLogo({ className, label }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "block shrink-0 bg-foreground [mask:url('/logo/grids-black.png')_center/contain_no-repeat] [-webkit-mask:url('/logo/grids-black.png')_center/contain_no-repeat]",
        className
      )}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
