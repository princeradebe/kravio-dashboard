import { useState } from "react";
import type * as React from "react";
import { kpiData, periods, type PeriodValue } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import { Icon } from "@/components/icon";
import { KpiGrid } from "@/components/kpi-cards";
import { PeriodSelect } from "@/components/period-select";
import { SlaTable } from "@/components/sla-table";
import { UpdatesFeed } from "@/components/updates-feed";
import { VolumeChart } from "@/components/volume-chart";

export function DashboardScreen(): React.ReactElement {
  const [period, setPeriod] = useState<PeriodValue>("last-week");
  const [trendPeriod, setTrendPeriod] = useState<PeriodValue>("last-week");
  const { settings } = useStore();

  const setBothPeriods = (next: PeriodValue) => {
    setPeriod(next);
    setTrendPeriod(next);
  };

  const compare = periods.find((entry) => entry.value === period)!.compare;

  return (
    <>
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex animate-rise flex-col items-start gap-4 leading-none">
          <h1 className="flex h-6 items-center gap-[0.25em] whitespace-nowrap font-medium text-2xl text-foreground">
            Hello, {settings.agentName}
            <span
              aria-hidden="true"
              className="inline-block origin-[70%_70%] animate-[wave_1.8s_ease-in-out_600ms_1]"
            >
              👋
            </span>
          </h1>
          <p className="text-[13px] text-secondary-foreground">
            Here are the latest insights from your customer interactions.
          </p>
        </div>
        <div className="flex animate-rise items-start gap-2 [animation-delay:60ms]">
          <PeriodSelect onChange={setBothPeriods} value={period} />
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label="Dashboard options"
                  size="icon"
                  variant="outline"
                >
                  <Icon name="more" />
                </Button>
              }
            />
            <MenuPopup align="end">
              <MenuGroup>
                <MenuItem onClick={() => window.location.reload()}>
                  Refresh data
                </MenuItem>
                <MenuItem onClick={() => window.print()}>
                  Print dashboard
                </MenuItem>
                <MenuItem onClick={() => setBothPeriods("last-week")}>
                  Reset range
                </MenuItem>
              </MenuGroup>
            </MenuPopup>
          </Menu>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-4 min-[1400px]:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <KpiGrid compare={compare} data={kpiData[period]} periodKey={period} />
            <VolumeChart onPeriodChange={setTrendPeriod} period={trendPeriod} />
          </div>
          <UpdatesFeed className="w-full shrink-0 min-[1400px]:w-[332px]" />
        </div>
        <SlaTable />
      </div>
    </>
  );
}
