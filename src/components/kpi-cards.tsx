import type * as React from "react";
import { kpiDefs, sparkDefs, type KpiDatum } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/animated-number";
import { AbsIcon, Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";

function KpiCard({
  def,
  kpi,
  compare,
  index,
  periodKey,
}: {
  def: (typeof kpiDefs)[number];
  kpi: KpiDatum;
  compare: string;
  index: number;
  periodKey: string;
}): React.ReactElement {
  const spark = sparkDefs[def.key];
  const positive = kpi.delta >= 0;
  const decimals = Number.isInteger(kpi.delta) ? 0 : 1;

  return (
    <Panel
      aria-label={def.title}
      className="group/kpi h-[140px] min-w-0 flex-1 animate-rise"
      patternStyle={{
        left: def.patternLeft,
        top: -0.8,
        transform: "translateX(-50%)",
      }}
      style={{ animationDelay: `${80 + index * 70}ms` }}
    >
      <PanelHeader>
        <PanelTitle className={def.tracking}>{def.title}</PanelTitle>
        <Icon
          className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/kpi:-rotate-12 group-hover/kpi:scale-110"
          name={def.icon}
        />
      </PanelHeader>
      <div className="relative flex min-h-px w-full flex-1 items-end justify-between rounded-[10px] border-[0.8px] border-border bg-card px-3 pb-3 transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] group-hover/kpi:-translate-y-px group-hover/kpi:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <div className="flex flex-col items-start gap-3 whitespace-nowrap leading-none">
          <p className="font-medium text-2xl text-foreground">
            <AnimatedNumber
              delay={150 + index * 90}
              suffix={kpi.suffix}
              value={kpi.value}
            />
          </p>
          <p className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-medium text-xs",
                positive ? "text-success" : "text-destructive",
              )}
            >
              <AnimatedNumber
                decimals={decimals}
                delay={250 + index * 90}
                duration={1100}
                prefix={positive ? "+" : ""}
                suffix="%"
                value={kpi.delta}
              />
            </span>
            <span className="text-[13px] text-muted-foreground">{compare}</span>
          </p>
        </div>
        <div className="flex items-end">
          <div
            className="relative shrink-0 animate-draw transition-transform duration-300 group-hover/kpi:scale-[1.04]"
            key={periodKey}
            style={{
              width: spark.box[0],
              height: spark.box[1],
              animationDelay: `${300 + index * 120}ms`,
              transformOrigin: "bottom right",
            }}
          >
            <AbsIcon
              h={spark.h}
              inset={spark.inset}
              name={spark.name}
              w={spark.w}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function KpiGrid({
  data,
  compare,
  periodKey,
}: {
  data: { tickets: KpiDatum; resolution: KpiDatum; sla: KpiDatum };
  compare: string;
  periodKey: string;
}): React.ReactElement {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {kpiDefs.map((def, i) => (
        <KpiCard
          compare={compare}
          def={def}
          index={i}
          key={def.key}
          kpi={data[def.key]}
          periodKey={periodKey}
        />
      ))}
    </div>
  );
}
