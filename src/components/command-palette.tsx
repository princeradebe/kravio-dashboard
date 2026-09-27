import { useMemo } from "react";
import type * as React from "react";
import { useNav, type View } from "@/lib/nav";
import { useStore } from "@/lib/store";
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Icon } from "@/components/icon";

interface PaletteAction {
  id: string;
  label: string;
  icon: string;
  hint?: string;
  run: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  const { navigate } = useNav();
  const { tickets } = useStore();

  const go = (view: View) => () => {
    navigate(view);
    onOpenChange(false);
  };

  const actions: PaletteAction[] = useMemo(
    () => [
      { id: "nav-overview", label: "Go to Overview", icon: "sb-dashboard", run: go({ name: "dashboard" }) },
      { id: "nav-tickets", label: "Go to Tickets", icon: "sb-ticket", run: go({ name: "tickets" }) },
      { id: "nav-sla-risk", label: "SLA Breach Risk", icon: "timer", run: go({ name: "tickets", tab: "sla-risk" }) },
      { id: "nav-escalations", label: "Escalations", icon: "feed-alert", run: go({ name: "tickets", tab: "escalations" }) },
      { id: "nav-clients", label: "Go to Clients", icon: "user-account", run: go({ name: "clients" }) },
      { id: "nav-agents", label: "Go to Agents & Teams", icon: "user-group", run: go({ name: "agents" }) },
      { id: "nav-kb", label: "Go to Knowledge Base", icon: "news", run: go({ name: "knowledge-base" }) },
      { id: "nav-integrations", label: "Go to Integrations", icon: "flow", run: go({ name: "integrations" }) },
      { id: "nav-sla", label: "Go to SLA Compliance", icon: "clock-01", run: go({ name: "sla-compliance" }) },
      { id: "nav-csat", label: "Go to CSAT & NPS", icon: "sb-star", run: go({ name: "csat" }) },
      { id: "nav-workload", label: "Go to Workload Analytics", icon: "analytics", run: go({ name: "workload" }) },
      { id: "nav-reports", label: "Go to Reports", icon: "sb-file", run: go({ name: "reports" }) },
      { id: "nav-feedback", label: "Go to Feedback", icon: "comment", run: go({ name: "feedback" }) },
      { id: "nav-help", label: "Go to Help & Support", icon: "headset", run: go({ name: "help" }) },
      { id: "nav-settings", label: "Go to Settings", icon: "sb-settings", run: go({ name: "settings" }) },
      ...tickets.map((t) => ({
        id: `ticket-${t.id}`,
        label: `${t.id} — ${t.subject}`,
        icon: "sb-ticket",
        hint: t.status,
        run: go({ name: "ticket-detail", ticketId: t.id }),
      })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickets, navigate, onOpenChange],
  );

  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <CommandDialogPopup>
        <Command items={actions} itemToStringValue={(a) => (a as PaletteAction).label}>
          <CommandInput placeholder="Search views, tickets, actions…" />
          <CommandEmpty>
            <div className="flex flex-col items-center gap-1 py-4 text-center">
              <Icon className="opacity-50" name="tb-search" />
              <p className="font-medium text-[13px] text-foreground">
                No results found
              </p>
              <p className="text-muted-foreground text-xs">
                Try a view name or a ticket number like #2325.
              </p>
            </div>
          </CommandEmpty>
          <CommandList>
            {(a: PaletteAction) => (
              <CommandItem key={a.id} onClick={a.run} value={a}>
                <span className="flex min-w-0 items-center gap-2">
                  <Icon name={a.icon} size={14} />
                  <span className="truncate">{a.label}</span>
                </span>
                {a.hint && (
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {a.hint}
                  </span>
                )}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
