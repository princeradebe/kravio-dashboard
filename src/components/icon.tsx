import type * as React from "react";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function Icon({
  name,
  size = 16,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}): React.ReactElement {
  return (
    <img
      alt=""
      className={cn("block shrink-0", className)}
      height={size}
      src={asset(name)}
      style={{ width: size, height: size, ...style }}
      width={size}
    />
  );
}

export function AbsIcon({
  name,
  w,
  h,
  inset,
  className,
}: {
  name: string;
  w: number;
  h: number;
  inset: string;
  className?: string;
}): React.ReactElement {
  return (
    <span
      className={cn("pointer-events-none absolute block", className)}
      style={{ inset }}
    >
      <img
        alt=""
        className="block size-full max-w-none"
        height={h}
        src={asset(name)}
        width={w}
      />
    </span>
  );
}
