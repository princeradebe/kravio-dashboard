"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import type * as React from "react";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: CheckboxPrimitive.Root.Props): React.ReactElement {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "group/cb relative size-4 shrink-0 cursor-pointer rounded-[4px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        className,
      )}
      data-slot="checkbox"
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-[#e1e4ea] transition-colors group-hover/cb:bg-[#d4d8e0] group-data-[checked]/cb:bg-[rgba(75,85,99,0.1)] group-data-[indeterminate]/cb:bg-[rgba(75,85,99,0.1)]"
      />
      <span
        aria-hidden="true"
        className="absolute top-0.5 left-0.5 flex size-3 items-center justify-center overflow-clip rounded-[3px] bg-white shadow-[0px_2.2px_3px_0px_rgba(27,28,29,0.12)] transition-colors group-data-[checked]/cb:bg-primary group-data-[indeterminate]/cb:bg-primary"
      >
        <CheckboxPrimitive.Indicator
          className="absolute top-1/2 left-1/2 flex size-2.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center animate-pop"
          render={(props, state) =>
            state.indeterminate ? (
              <span {...props}>
                <span className="block h-[1.2px] w-1.5 rounded-full bg-white" />
              </span>
            ) : (
              <span {...props}>
                <img
                  alt=""
                  className="block size-2.5"
                  height={10}
                  src={asset("check-tick")}
                  width={10}
                />
              </span>
            )
          }
        />
      </span>
    </CheckboxPrimitive.Root>
  );
}

export { CheckboxPrimitive };
