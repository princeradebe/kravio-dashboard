"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: AvatarPrimitive.Root.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative inline-flex size-5 shrink-0 select-none overflow-hidden rounded-full",
        className,
      )}
      data-slot="avatar"
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: AvatarPrimitive.Image.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square h-full w-full object-cover", className)}
      data-slot="avatar-image"
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-full bg-secondary font-semibold text-[9px] text-secondary-foreground leading-none",
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

export { AvatarPrimitive };
