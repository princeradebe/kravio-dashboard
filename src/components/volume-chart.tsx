import type * as React from "react";
import { useEffect, useState } from "react";
import {
  barCount,
  barWidth,
  barX,
  chartData,
  chartHeight,
  pctX,
  periods,
  xAxisDays,
  yAxisTicks,
  type PeriodValue,
} from "@/lib/data";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/animated-number";
import { AbsIcon, Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { PeriodSelect } from "@/components/period-select";

export function VolumeChart({
  period,
  onPeriodChange,
}: {
  period: PeriodValue;
  onPeriodChange: (period: PeriodValue) => void;
}): React.ReactElement {
  const data = chartData[period];
  const compare = periods.find((entry) => entry.value === period)!.compare;
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = hovered ?? pinned ?? data.active;

  useEffect(() => setPinned(null), [period]);

  const bar = data.bars[active];
  const x = barX[active];
  const barTop = chartHeight - bar.height;
  const count = barCount(bar.height);
  const flipRight = x < 81;

  return (
    <Panel
      aria-labelledby="trend-title"
      className="h-[404px] w-full animate-rise [animation-delay:260ms]"
      patternStyle={{
        left: "calc(50% - 0.5px)",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <PanelHeader>
        <div className="flex items-center gap-3">
          <Icon name="ticket" />
          <PanelTitle id="trend-title">Ticket Volume Trend</PanelTitle>
        </div>
        <PeriodSelect
          label="Trend range"
          onChange={onPeriodChange}
          value={period}
          variant="surface"
        />
      </PanelHeader>
      <div className="relative flex min-h-px w-full flex-1 flex-col items-start justify-between overflow-clip rounded-xl border-[0.8px] border-input bg-card px-3.5 pt-4 pb-3.5">
        <div className="flex items-end gap-3 whitespace-nowrap leading-none">
          <p className="font-medium text-[32px] text-foreground">
            <AnimatedNumber delay={320} value={data.total} />
          </p>
          <p className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-medium text-xs",
                data.delta >= 0 ? "text-success" : "text-destructive",
              )}
            >
              <AnimatedNumber
                delay={420}
                duration={1000}
                prefix={data.delta >= 0 ? "+" : ""}
                suffix="%"
                value={data.delta}
              />
            </span>
            <span className="text-[13px] text-muted-foreground tracking-[-0.13px]">
              {compare}
            </span>
          </p>
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div
              aria-label="Ticket volume by half-day. Use left and right arrow keys to inspect bars."
              className="relative h-[216px] w-full overflow-clip rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const next = Math.min(
                    data.bars.length - 1,
                    Math.max(0, active + (event.key === "ArrowRight" ? 1 : -1)),
                  );
                  setPinned(next);
                  setHovered(null);
                }
              }}
              onMouseLeave={() => setHovered(null)}
              role="group"
              tabIndex={0}
            >
              <span className="pointer-events-none absolute top-px left-0 block h-[214px] w-full min-w-[825px]">
                <AbsIcon
                  h={216}
                  inset="-0.19% 0 -0.42% 0"
                  name="grid"
                  w={825}
                />
              </span>
              {data.bars.map((entry, i) => {
                const isActive = i === active;
                return (
                  <div
                    className="absolute bottom-0 transition-[height] duration-700 ease-[var(--ease-out-expo)]"
                    key={i}
                    style={{
                      left: pctX(barX[i]),
                      width: pctX(barWidth),
                      height: entry.height,
                    }}
                  >
                    <div
                      className="relative size-full animate-grow"
                      style={{ animationDelay: `${380 + i * 45}ms` }}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 rounded-b-[4px] rounded-t-[8px] transition-opacity duration-300",
                          isActive ? "opacity-0" : "opacity-100",
                        )}
                      >
                        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-[#e6e6e6] to-[rgba(230,230,230,0.6)] backdrop-blur-[50px]" />
                        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_0.444px_var(--chart-bar-border),inset_0px_0px_0px_1px_white]" />
                      </div>
                      <div
                        className={cn(
                          "absolute inset-0 rounded-b-[4px] rounded-t-[8px] bg-[linear-gradient(180deg,#37475d_0%,#1f2937_64.697%)] shadow-[inset_0_0_0_0.44px_#1f2937,0px_2px_10px_0px_rgba(31,41,55,0.08)] transition-[opacity,transform] duration-300",
                          isActive ? "opacity-100" : "scale-y-[0.98] opacity-0",
                        )}
                        style={{ transformOrigin: "bottom" }}
                      />
                    </div>
                  </div>
                );
              })}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 animate-fade [animation-delay:1100ms]"
              >
                <div
                  className="absolute h-0 transition-[left,top] duration-500 ease-[var(--ease-out-expo)]"
                  style={{
                    left: `calc(${pctX(x)} + 3px)`,
                    top: barTop - 0.5,
                    width: `max(559px, calc(100% - ${pctX(x)} - 3px))`,
                  }}
                >
                  <AbsIcon
                    h={1}
                    inset="-0.4px 0"
                    name="dashed-line"
                    w={560}
                  />
                </div>
                <img
                  alt=""
                  className="absolute block size-1 transition-[left,top] duration-500 ease-[var(--ease-out-expo)]"
                  height={4}
                  key={flipRight ? "r" : "l"}
                  src={asset("line-dot")}
                  style={{
                    left: flipRight
                      ? `calc(${pctX(x + barWidth)})`
                      : `calc(${pctX(x)} - 4px)`,
                    top: barTop - 2.5,
                  }}
                  width={4}
                />
                <div
                  className="absolute h-6 w-[75px] transition-[left,top] duration-500 ease-[var(--ease-out-expo)]"
                  style={{
                    left: flipRight
                      ? `calc(${pctX(x + barWidth)} + 6px)`
                      : `calc(${pctX(x)} - 81px)`,
                    top: barTop - 12,
                  }}
                >
                  <AbsIcon
                    className={flipRight ? "-scale-x-100" : undefined}
                    h={24}
                    inset="0 3.2% 0 0"
                    name="tooltip-tag"
                    w={73}
                  />
                  <p
                    className="absolute top-1.5 animate-fade whitespace-nowrap font-medium text-white text-xs leading-none"
                    key={`${bar.label}-${count}`}
                    style={{ left: flipRight ? 14 : 6 }}
                  >
                    {bar.label} : {count}
                  </p>
                </div>
              </div>
              {data.bars.map((entry, i) => (
                <button
                  aria-label={`${entry.label}: ${barCount(entry.height)} tickets`}
                  className="absolute top-0 bottom-0 cursor-crosshair"
                  key={`hit-${i}`}
                  onClick={() => setPinned(i)}
                  onFocus={() => setHovered(i)}
                  onMouseEnter={() => setHovered(i)}
                  style={{
                    left: `calc(${pctX(barX[i])} - 8px)`,
                    width: `calc(${pctX(barWidth)} + 16px)`,
                  }}
                  tabIndex={-1}
                  type="button"
                />
              ))}
              <div className="pointer-events-none absolute top-0 left-0 h-[215px] w-[85px] bg-gradient-to-l from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.6)]" />
              <div className="pointer-events-none absolute top-0 right-0 h-[215px] w-[85px] bg-gradient-to-r from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.6)]" />
              <p aria-live="polite" className="sr-only">
                {bar.label}: {count} tickets
              </p>
            </div>
            <div
              aria-hidden="true"
              className="flex w-full items-center gap-1.5"
            >
              {xAxisDays.map((day) => (
                <div
                  className="flex min-w-0 flex-1 items-center justify-center"
                  key={day}
                >
                  <p
                    className={cn(
                      "whitespace-nowrap text-[13px] leading-none tracking-[-0.13px] transition-colors duration-300",
                      (hovered ?? pinned) !== null && day === bar.label
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {day}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            aria-hidden="true"
            className="flex h-[220px] flex-col items-end justify-between"
          >
            {yAxisTicks.map((tick) => (
              <div
                className="flex w-full items-center justify-center"
                key={tick}
              >
                <p className="whitespace-nowrap text-[13px] text-muted-foreground leading-none tracking-[-0.13px]">
                  {tick}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
