import type * as React from "react";
import { cn } from "@/lib/utils";

export function ScreenHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-start justify-between gap-4",
        className,
      )}
    >
      <div className="flex animate-rise flex-col items-start gap-2 leading-none">
        <h1 className="flex min-h-6 items-center whitespace-nowrap font-medium text-2xl text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-[13px] text-secondary-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex animate-rise items-start gap-2 [animation-delay:60ms]">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
