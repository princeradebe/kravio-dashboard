"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium leading-none outline-none transition-[background-color,border-color,box-shadow,transform,color] duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_img]:pointer-events-none [&_img]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "outline",
    },
    variants: {
      size: {
        default: "h-8 gap-1.5 pl-2.5 pr-2 text-xs",
        sm: "h-7 gap-1.5 px-2 text-xs",
        icon: "size-8 p-2",
        "icon-sm": "size-6 p-1",
      },
      variant: {
        outline:
          "rounded-lg border-[0.8px] border-border bg-card text-secondary-foreground hover:border-[#d1d5db] hover:bg-[#fcfcfc] hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] data-[popup-open]:border-[#d1d5db] data-[popup-open]:bg-[#fcfcfc]",
        surface:
          "rounded-lg border-[0.8px] border-input bg-card text-secondary-foreground hover:bg-[#fcfcfc] hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] data-[popup-open]:bg-[#fcfcfc]",
        ghost: "rounded-md text-secondary-foreground hover:bg-black/[0.04]",
        primary:
          "rounded-lg border border-primary bg-[linear-gradient(180deg,#37475d_0%,#1f2937_64.7%)] text-primary-foreground hover:brightness-110",
      },
    },
  },
);

export interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  render,
  children,
  loading = false,
  disabled: disabledProp,
  ...props
}: ButtonProps): React.ReactElement {
  const isDisabled: boolean = Boolean(loading || disabledProp);
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    render ? undefined : "button";

  const defaultProps = {
    children: (
      <>
        {children}
        {loading && (
          <Spinner
            className="pointer-events-none absolute"
            data-slot="button-loading-indicator"
          />
        )}
      </>
    ),
    className: cn(buttonVariants({ className, size, variant })),
    "aria-disabled": loading || undefined,
    "data-loading": loading ? "" : undefined,
    "data-slot": "button",
    disabled: isDisabled,
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}
