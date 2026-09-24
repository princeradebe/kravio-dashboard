"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function InputGroup({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const target = event.currentTarget.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >("input, textarea");
    target?.focus();
  };

  return (
    <div
      className={cn(
        "group/input flex h-8 cursor-text items-center gap-2 overflow-clip rounded-lg border-[0.8px] border-border bg-card py-2 pr-2 pl-2.5 transition-[border-color,box-shadow] duration-150 focus-within:border-[#9ca3af] focus-within:shadow-[0_0_0_3px_rgba(156,163,175,0.18)] hover:border-[#d1d5db]",
        className,
      )}
      data-slot="input-group"
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function InputGroupAddon({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("flex shrink-0 items-center", className)}
      data-slot="input-group-addon"
      {...props}
    />
  );
}

export function InputGroupText({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      className={cn("flex items-center", className)}
      data-slot="input-group-text"
      {...props}
    />
  );
}

export function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">): React.ReactElement {
  return (
    <Input
      className={cn(
        "min-w-0 flex-1 bg-transparent text-[13px] text-foreground leading-none outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
        className,
      )}
      data-slot="input-group-input"
      {...props}
    />
  );
}

export function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">): React.ReactElement {
  return (
    <textarea
      className={cn(
        "min-w-0 flex-1 resize-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground",
        className,
      )}
      data-slot="input-group-textarea"
      {...props}
    />
  );
}
