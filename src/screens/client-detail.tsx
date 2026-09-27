import type * as React from "react";
import { slaLabel, statusIcons } from "@/lib/data";
import { useNav } from "@/lib/nav";
import { initials, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { TicketStatusBadge } from "@/components/badges";

export function ClientDetailScreen({
  clientId,
}: {
  clientId?: string;
}): React.ReactElement {
  const { clients, tickets } = useStore();
  const { navigate } = useNav();
  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <Panel className="w-full animate-rise">
        <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-center">
          <Icon className="opacity-50" name="user-account" />
          <p className="font-medium text-[13px] text-foreground">
            Client not found
          </p>
          <Button
            className="mt-2"
            onClick={() => navigate({ name: "clients" })}
            size="sm"
          >
            Back to Clients
          </Button>
        </div>
      </Panel>
    );
  }

  const theirTickets = tickets.filter((t) => t.clientId === client.id);
  const open = theirTickets.filter(
    (t) => t.status !== "Delivered" && t.status !== "Closed",
  );

  return (
    <>
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex animate-rise flex-col items-start gap-2">
          <button
            className="flex items-center gap-1.5 rounded-md text-muted-foreground text-xs leading-none outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
            onClick={() => navigate({ name: "clients" })}
            type="button"
          >
            <Icon className="rotate-90" name="arrow-up" size={10} />
            Clients
          </button>
          <h1 className="flex min-h-6 items-center gap-2.5 font-medium text-2xl text-foreground">
            {client.company}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="info">{client.plan}</Badge>
            <Badge variant="outline">{client.region}</Badge>
            <span className="text-muted-foreground text-xs">
              Joined {client.joined}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 min-[1200px]:flex-row">
        <Panel
          className="min-w-0 flex-1 animate-rise [animation-delay:120ms]"
          patternStyle={{
            left: "calc(50% - 28.5px)",
            top: "calc(50% + 58.5px)",
            transform: "translate(-50%, -50%)",
          }}
        >
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="sb-ticket" />
              <PanelTitle>Ticket History</PanelTitle>
            </div>
            <span className="text-muted-foreground text-xs tabular-nums">
              {open.length} open · {theirTickets.length} total
            </span>
          </PanelHeader>
          <div className="flex flex-col gap-1.5 rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {theirTickets.map((t, i) => (
              <button
                className="flex h-11 w-full animate-rise items-center gap-3 rounded-lg px-3 text-left outline-none transition-colors hover:bg-secondary focus-visible:ring-[3px] focus-visible:ring-ring/40"
                key={t.id}
                onClick={() =>
                  navigate({ name: "ticket-detail", ticketId: t.id })
                }
                style={{ animationDelay: `${160 + i * 30}ms` }}
                type="button"
              >
                <Icon name={statusIcons[t.status]} />
                <span className="w-16 shrink-0 font-medium text-[13px] text-cell-foreground leading-none tabular-nums">
                  {t.id}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-foreground leading-none">
                  {t.subject}
                </span>
                <TicketStatusBadge status={t.status} />
                <span
                  className={cn(
                    "w-20 shrink-0 text-right text-xs leading-none tabular-nums",
                    t.slaHours < 0
                      ? "font-semibold text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {slaLabel(t.slaHours)}
                </span>
              </button>
            ))}
            {theirTickets.length === 0 && (
              <div className="flex h-[140px] flex-col items-center justify-center gap-1.5 text-center">
                <Icon className="opacity-50" name="sb-ticket" />
                <p className="font-medium text-[13px] text-foreground">
                  No tickets yet
                </p>
                <p className="text-muted-foreground text-xs">
                  Tickets from {client.contact} will appear here.
                </p>
              </div>
            )}
          </div>
        </Panel>

        <Panel
          className="w-full shrink-0 animate-rise [animation-delay:160ms] min-[1200px]:w-[320px]"
          patternStyle={{
            left: "calc(50% - 28.5px)",
            top: "calc(50% + 58.5px)",
            transform: "translate(-50%, -50%)",
          }}
        >
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="user-account" />
              <PanelTitle>Account</PanelTitle>
            </div>
          </PanelHeader>
          <div className="flex flex-col gap-3 rounded-xl bg-card p-3.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-9">
                <AvatarFallback className="text-xs">
                  {initials(client.company)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-1 leading-none">
                <span className="truncate font-medium text-[13px] text-foreground">
                  {client.contact}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  Primary contact
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-black/[0.06] border-t pt-3">
              {[
                { label: "Email", value: client.email },
                { label: "Plan", value: client.plan },
                { label: "Region", value: client.region },
                { label: "Customer since", value: client.joined },
              ].map((row) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={row.label}
                >
                  <span className="font-medium text-muted-foreground text-xs leading-none">
                    {row.label}
                  </span>
                  <span className="truncate text-[13px] text-foreground leading-none">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
