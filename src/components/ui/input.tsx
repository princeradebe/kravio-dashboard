"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};

export function Input({
  className,
  size = "default",
  unstyled = false,
  nativeInput = false,
  style,
  ...props
}: InputProps): React.ReactElement {
  const inputClassName = cn(
    !unstyled &&
      "min-w-0 flex-1 bg-transparent text-[13px] text-foreground leading-none outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
    size === "sm" && "text-xs",
    size === "lg" && "text-sm",
    props.type === "search" &&
      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
    className,
  );

  if (nativeInput) {
    return (
      <input
        className={inputClassName}
        data-slot="input"
        size={typeof size === "number" ? size : undefined}
        style={typeof style === "function" ? undefined : style}
        {...props}
      />
    );
  }

  return (
    <InputPrimitive
      className={inputClassName}
      data-slot="input"
      size={typeof size === "number" ? size : undefined}
      style={style}
      {...props}
    />
  );
}

export { InputPrimitive };
