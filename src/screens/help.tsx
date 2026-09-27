import type * as React from "react";
import { useNav } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";

const shortcuts = [
  { keys: ["⌘", "K"], action: "Open search & actions" },
  { keys: ["Esc"], action: "Close dialogs and menus" },
  { keys: ["⌘", "↵"], action: "Send a ticket reply" },
  { keys: ["↑", "↓"], action: "Move through menus" },
];

const resources = [
  {
    icon: "news",
    title: "Product Documentation",
    desc: "Setup guides, feature references, and migration notes.",
    view: { name: "knowledge-base" } as const,
  },
  {
    icon: "sb-ticket",
    title: "Open a Support Ticket",
    desc: "Reach the team — median first response is under 2 hours.",
    view: { name: "tickets" } as const,
  },
  {
    icon: "analytics",
    title: "System Status",
    desc: "All systems operational. Last incident: 21 days ago.",
    view: { name: "sla-compliance" } as const,
  },
];

export function HelpScreen(): React.ReactElement {
  const { articles } = useStore();
  const { navigate } = useNav();
  const popular = articles
    .filter((a) => a.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <>
      <ScreenHeader
        description="Docs, shortcuts, and how to reach us."
        title="Help & Support"
      />
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {resources.map((r, i) => (
          <button
            className="group flex animate-rise flex-col gap-2.5 rounded-xl bg-card p-4 text-left shadow-[inset_0_0_0_0.8px_var(--input)] outline-none transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_0_0_0.8px_var(--input)] focus-visible:ring-[3px] focus-visible:ring-ring/40"
            key={r.title}
            onClick={() => navigate(r.view)}
            style={{ animationDelay: `${120 + i * 40}ms` }}
            type="button"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-secondary transition-transform duration-200 group-hover:scale-105">
              <Icon name={r.icon} />
            </span>
            <span className="font-medium text-[13px] text-foreground leading-none">
              {r.title}
            </span>
            <span className="text-muted-foreground text-xs leading-relaxed">
              {r.desc}
            </span>
          </button>
        ))}
      </div>
      <div className="flex w-full flex-col gap-4 min-[1200px]:flex-row">
        <Panel className="min-w-0 flex-1 animate-rise [animation-delay:200ms]">
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="news" />
              <PanelTitle>Most-Read Articles</PanelTitle>
            </div>
          </PanelHeader>
          <div className="flex flex-col gap-1.5 rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {popular.map((a, i) => (
              <button
                className="flex animate-rise items-center gap-3 rounded-lg px-3 py-2.5 text-left outline-none transition-colors hover:bg-secondary/60 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                key={a.id}
                onClick={() =>
                  navigate({ name: "article-editor", articleId: a.id })
                }
                style={{ animationDelay: `${200 + i * 30}ms` }}
                type="button"
              >
                <Icon name="news" size={14} />
                <span className="min-w-0 flex-1 truncate font-medium text-[13px] text-foreground leading-none">
                  {a.title}
                </span>
                <Badge variant="secondary">{a.category}</Badge>
                <span className="text-muted-foreground text-xs leading-none tabular-nums">
                  {new Intl.NumberFormat("en-US").format(a.views)} views
                </span>
              </button>
            ))}
          </div>
        </Panel>
        <Panel className="w-full shrink-0 animate-rise [animation-delay:240ms] min-[1200px]:w-[360px]">
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="command" />
              <PanelTitle>Keyboard Shortcuts</PanelTitle>
            </div>
          </PanelHeader>
          <div className="flex flex-col gap-1 rounded-xl bg-card p-2.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {shortcuts.map((s) => (
              <div
                className="flex items-center justify-between rounded-lg px-2 py-2"
                key={s.action}
              >
                <span className="text-[13px] text-secondary-foreground leading-none">
                  {s.action}
                </span>
                <span className="flex items-center gap-1">
                  {s.keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
