import type * as React from "react";
import { useEffect, useState } from "react";
import { kpiData, periods, type PeriodValue } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Icon } from "@/components/icon";
import { KpiGrid } from "@/components/kpi-cards";
import { PeriodSelect } from "@/components/period-select";
import { Sidebar } from "@/components/sidebar";
import { SlaTable } from "@/components/sla-table";
import { TopBar } from "@/components/top-bar";
import { UpdatesFeed } from "@/components/updates-feed";
import { VolumeChart } from "@/components/volume-chart";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = () => setMatches(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function App(): React.ReactElement {
  const [period, setPeriod] = useState<PeriodValue>("last-week");
  const [trendPeriod, setTrendPeriod] = useState<PeriodValue>("last-week");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const setBothPeriods = (next: PeriodValue) => {
    setPeriod(next);
    setTrendPeriod(next);
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  const compare = periods.find((entry) => entry.value === period)!.compare;
  const sidebarHidden = !isDesktop || sidebarCollapsed;

  return (
    <TooltipProvider delay={250}>
      <div className="flex min-h-dvh w-full bg-background">
        <div
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 overflow-hidden transition-[width] duration-300 ease-[var(--ease-out-expo)] lg:block",
            sidebarCollapsed ? "w-0" : "w-[250px]",
          )}
          inert={sidebarCollapsed || undefined}
        >
          <Sidebar
            className={cn(
              "transition-opacity duration-200",
              sidebarCollapsed && "opacity-0",
            )}
            onCollapse={() => setSidebarCollapsed(true)}
          />
        </div>
        <div
          aria-hidden={!mobileOpen}
          className={cn(
            "fixed inset-0 z-40 lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300",
              mobileOpen ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setMobileOpen(false)}
          />
          <div
            aria-label="Navigation"
            aria-modal="true"
            className={cn(
              "absolute inset-y-0 left-0 h-dvh bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] transition-transform duration-300 ease-[var(--ease-out-expo)]",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
            inert={!mobileOpen || undefined}
            role="dialog"
          >
            <Sidebar onCollapse={() => setMobileOpen(false)} />
          </div>
        </div>
        <main className="flex min-w-0 flex-1 flex-col bg-card px-3 shadow-[inset_0_0_0_0.8px_var(--border)] lg:min-h-dvh">
          <TopBar
            onMenu={() =>
              isDesktop ? setSidebarCollapsed(false) : setMobileOpen(true)
            }
            sidebarHidden={sidebarHidden}
          />
          <div className="flex w-full flex-col px-1 py-4">
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-wrap items-start justify-between gap-4">
                <div className="flex animate-rise flex-col items-start gap-4 leading-none">
                  <h1 className="flex h-6 items-center gap-[0.25em] whitespace-nowrap font-medium text-2xl text-foreground">
                    Hello, Achmad Hakim
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
                    <KpiGrid
                      compare={compare}
                      data={kpiData[period]}
                      periodKey={period}
                    />
                    <VolumeChart
                      onPeriodChange={setTrendPeriod}
                      period={trendPeriod}
                    />
                  </div>
                  <UpdatesFeed className="w-full shrink-0 min-[1400px]:w-[332px]" />
                </div>
                <SlaTable />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
