"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

export const toggleVariants = cva(
  "relative z-10 flex h-7 min-w-0 flex-1 items-center justify-center rounded-lg border-[0.8px] border-border bg-card pr-2 pl-2.5 font-medium text-secondary-foreground text-xs leading-none outline-none transition-[color,background-color,border-color,transform] duration-200 hover:bg-[#fafafa] focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.97] data-pressed:border-transparent data-pressed:bg-transparent data-pressed:text-primary-foreground",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "",
        sm: "h-6 px-1.5",
        lg: "h-8 px-3",
      },
      variant: {
        default: "",
        outline: "",
      },
    },
  },
);

export function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof toggleVariants>): React.ReactElement {
  return (
    <TogglePrimitive
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      {...props}
    />
  );
}

export { TogglePrimitive };
