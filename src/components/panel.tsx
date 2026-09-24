import type * as React from "react";
import { asset } from "@/lib/assets";
import { Frame, FrameHeader, FrameTitle } from "@/components/ui/frame";

export function Panel({
  className,
  patternStyle,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  patternStyle?: React.CSSProperties;
}): React.ReactElement {
  return (
    <Frame className={className} {...props}>
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute block h-[560px] w-[1639px] max-w-none"
        height={560}
        src={asset("card-pattern")}
        style={patternStyle}
        width={1639}
      />
      {children}
    </Frame>
  );
}

export const PanelHeader = FrameHeader;
export const PanelTitle = FrameTitle;
