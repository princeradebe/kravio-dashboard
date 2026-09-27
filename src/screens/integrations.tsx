import { useMemo, useState } from "react";
import type * as React from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";

const categoryIcons: Record<string, string> = {
  Communication: "comment",
  Productivity: "flow",
  Data: "analytics",
  Auth: "check-tick",
};

export function IntegrationsScreen(): React.ReactElement {
  const { integrations, toggleIntegration } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...new Set(integrations.map((i) => i.category))],
    [integrations],
  );
  const visible = integrations.filter(
    (i) => activeCategory === "all" || i.category === activeCategory,
  );
  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <>
      <ScreenHeader
        actions={
          <Badge className="h-8 px-2.5" variant="secondary">
            {connectedCount} connected
          </Badge>
        }
        description="Connect Kravio to the rest of your stack."
        title="Integrations"
      />
      <Panel
        aria-label="Integrations"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader>
          <div className="flex items-center gap-3">
            <Icon name="flow" />
            <PanelTitle>Available Integrations</PanelTitle>
          </div>
          <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
            {categories.map((c) => (
              <button
                aria-current={activeCategory === c ? "true" : undefined}
                className={cn(
                  "h-7 whitespace-nowrap rounded-md px-2.5 text-xs leading-none capitalize outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40",
                  activeCategory === c
                    ? "bg-card font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={c}
                onClick={() => setActiveCategory(c)}
                type="button"
              >
                {c}
              </button>
            ))}
          </div>
        </PanelHeader>
        <div className="grid grid-cols-1 gap-1.5 rounded-xl bg-card p-3 shadow-[inset_0_0_0_0.8px_var(--input)] sm:grid-cols-2">
          {visible.map((integration, i) => (
            <div
              className="flex animate-rise items-center gap-3 rounded-xl bg-secondary/50 p-3.5 transition-colors hover:bg-secondary"
              key={integration.id}
              style={{ animationDelay: `${140 + i * 30}ms` }}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card shadow-[inset_0_0_0_0.8px_var(--input)]">
                <Icon name={categoryIcons[integration.category] ?? "flow"} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1 leading-none">
                <span className="flex items-center gap-2 font-medium text-[13px] text-foreground">
                  {integration.name}
                  {integration.connected && (
                    <Badge variant="success">Connected</Badge>
                  )}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {integration.blurb}
                </span>
              </div>
              <Switch
                aria-label={`${integration.connected ? "Disconnect" : "Connect"} ${integration.name}`}
                checked={integration.connected}
                onCheckedChange={() => toggleIntegration(integration.id)}
              />
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
