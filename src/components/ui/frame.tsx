import type * as React from "react";
import { cn } from "@/lib/utils";

export function Frame({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "relative flex flex-col items-start overflow-clip rounded-xl bg-muted p-1 shadow-[inset_0_0_0_0.8px_var(--border)]",
        className,
      )}
      data-slot="frame"
      {...props}
    />
  );
}

export function FramePanel({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "relative rounded-[10px] border-[0.8px] border-border bg-card",
        className,
      )}
      data-slot="frame-panel"
      {...props}
    />
  );
}

export function FrameHeader({
  className,
  ...props
}: React.ComponentProps<"header">): React.ReactElement {
  return (
    <header
      className={cn(
        "relative flex w-full shrink-0 items-center justify-between p-2",
        className,
      )}
      data-slot="frame-panel-header"
      {...props}
    />
  );
}

export function FrameTitle({
  className,
  ...props
}: React.ComponentProps<"h2">): React.ReactElement {
  return (
    <h2
      className={cn(
        "whitespace-nowrap font-medium text-secondary-foreground text-sm leading-none",
        className,
      )}
      data-slot="frame-panel-title"
      {...props}
    />
  );
}

export function FrameDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="frame-panel-description"
      {...props}
    />
  );
}

export function FrameFooter({
  className,
  ...props
}: React.ComponentProps<"footer">): React.ReactElement {
  return (
    <footer
      className={cn("px-5 py-4", className)}
      data-slot="frame-panel-footer"
      {...props}
    />
  );
}
