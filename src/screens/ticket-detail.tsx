import { useState } from "react";
import type * as React from "react";
import { asset } from "@/lib/assets";
import { slaLabel } from "@/lib/data";
import { useNav } from "@/lib/nav";
import {
  initials,
  useStore,
  type Channel,
  type Priority,
  type TicketStatus,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TicketStatusBadge, PriorityBadge } from "@/components/badges";

const channels: Channel[] = ["Email", "Chat", "Form", "Phone"];
const priorities: Priority[] = ["High", "Medium", "Low"];
const statuses: TicketStatus[] = [
  "In Review",
  "In Progress",
  "Delivered",
  "Escalated",
  "Closed",
];

export function TicketDetailScreen({
  ticketId,
}: {
  ticketId?: string;
}): React.ReactElement {
  const { tickets, clients, agents, settings, patchTicket, deleteTicket, addTicketMessage } =
    useStore();
  const { navigate } = useNav();
  const [reply, setReply] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const ticket = tickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return (
      <Panel className="w-full animate-rise">
        <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-center">
          <Icon className="opacity-50" name="sb-ticket" />
          <p className="font-medium text-[13px] text-foreground">
            Ticket not found
          </p>
          <p className="text-muted-foreground text-xs">
            It may have been deleted.
          </p>
          <Button
            className="mt-2"
            onClick={() => navigate({ name: "tickets" })}
            size="sm"
          >
            Back to Tickets
          </Button>
        </div>
      </Panel>
    );
  }

  const client = clients.find((c) => c.id === ticket.clientId);
  const agent = agents.find((a) => a.name === ticket.assignee);
  const overdue = ticket.slaHours < 0;

  const sendReply = () => {
    const body = reply.trim();
    if (!body) return;
    addTicketMessage(ticket.id, {
      author: settings.agentName,
      role: "agent",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      body,
    });
    if (ticket.status === "In Review") {
      patchTicket(ticket.id, { status: "In Progress" });
    }
    setReply("");
  };

  return (
    <>
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex animate-rise flex-col items-start gap-2">
          <button
            className="flex items-center gap-1.5 rounded-md text-muted-foreground text-xs leading-none outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
            onClick={() => navigate({ name: "tickets" })}
            type="button"
          >
            <Icon className="rotate-90" name="arrow-up" size={10} />
            Tickets
          </button>
          <h1 className="flex min-h-6 items-center gap-2.5 font-medium text-2xl text-foreground">
            <span className="text-muted-foreground tabular-nums">{ticket.id}</span>
            {ticket.subject}
          </h1>
          <div className="flex items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <Badge variant="outline">{ticket.channel}</Badge>
            {ticket.escalated && <Badge variant="error">Escalated</Badge>}
          </div>
        </div>
        <div className="flex animate-rise items-start gap-2 [animation-delay:60ms]">
          {!ticket.escalated && (
            <Button
              onClick={() =>
                patchTicket(ticket.id, { escalated: true, status: "Escalated" })
              }
              variant="outline"
            >
              <Icon name="feed-alert" />
              Escalate
            </Button>
          )}
          <Menu>
            <MenuTrigger
              render={
                <Button aria-label="Ticket actions" size="icon" variant="outline">
                  <Icon name="more" />
                </Button>
              }
            />
            <MenuPopup align="end">
              <MenuGroup>
                <MenuItem
                  disabled={ticket.status === "Closed"}
                  onClick={() => patchTicket(ticket.id, { status: "Closed" })}
                >
                  <Icon name="check-tick" />
                  Close ticket
                </MenuItem>
                <MenuItem
                  disabled={ticket.status === "Delivered"}
                  onClick={() => patchTicket(ticket.id, { status: "Delivered" })}
                >
                  <Icon name="status-delivered" />
                  Mark delivered
                </MenuItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuGroup>
                <MenuItem
                  className="text-destructive data-highlighted:bg-destructive/8 data-highlighted:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete ticket
                </MenuItem>
              </MenuGroup>
            </MenuPopup>
          </Menu>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 min-[1200px]:flex-row">
        <Panel
          aria-label="Conversation"
          className="min-w-0 flex-1 animate-rise [animation-delay:120ms]"
          patternStyle={{
            left: "calc(50% - 28.5px)",
            top: "calc(50% + 58.5px)",
            transform: "translate(-50%, -50%)",
          }}
        >
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="comment" />
              <PanelTitle>Conversation</PanelTitle>
            </div>
            <span className="text-muted-foreground text-xs tabular-nums">
              {ticket.messages.length} message
              {ticket.messages.length === 1 ? "" : "s"}
            </span>
          </PanelHeader>
          <div className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {ticket.messages.map((m) => {
              const isAgent = m.role === "agent";
              const sender = isAgent
                ? agents.find((a) => a.name === m.author)
                : undefined;
              return (
                <div
                  className={cn(
                    "flex gap-2.5 animate-fade",
                    isAgent && "flex-row-reverse",
                  )}
                  key={m.id}
                >
                  <Avatar className="size-7 shrink-0">
                    {sender?.avatar ? (
                      <AvatarImage alt="" src={asset(sender.avatar)} />
                    ) : null}
                    <AvatarFallback className="text-[10px]">
                      {initials(m.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex min-w-0 max-w-[80%] flex-col gap-1",
                      isAgent && "items-end",
                    )}
                  >
                    <div className="flex items-center gap-2 text-[11px] leading-none">
                      <span className="font-medium text-foreground">
                        {m.author}
                      </span>
                      <span className="text-muted-foreground">{m.time}</span>
                    </div>
                    <div
                      className={cn(
                        "rounded-xl px-3 py-2 text-[13px] leading-relaxed",
                        isAgent
                          ? "rounded-tr-sm bg-primary text-primary-foreground"
                          : "rounded-tl-sm bg-secondary text-secondary-foreground",
                      )}
                    >
                      {m.body}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="mt-1 flex flex-col gap-2 border-black/[0.06] border-t pt-3">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="reply-box"
              >
                Reply as {settings.agentName}
              </label>
              <Textarea
                id="reply-box"
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") sendReply();
                }}
                placeholder="Write a reply… (⌘↵ to send)"
                rows={3}
                value={reply}
              />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  Replies move the ticket to In Progress.
                </span>
                <Button disabled={!reply.trim()} onClick={sendReply} size="sm">
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex w-full shrink-0 flex-col gap-4 min-[1200px]:w-[320px]">
          <Panel
            className="animate-rise [animation-delay:160ms]"
            patternStyle={{
              left: "calc(50% - 28.5px)",
              top: "calc(50% + 58.5px)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <PanelHeader>
              <div className="flex items-center gap-3">
                <Icon name="hd-settings" />
                <PanelTitle>Details</PanelTitle>
              </div>
            </PanelHeader>
            <div className="flex flex-col gap-3 rounded-xl bg-card p-3.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
              {(
                [
                  {
                    label: "Status",
                    node: (
                      <Select
                        onValueChange={(v) =>
                          patchTicket(ticket.id, {
                            status: v as TicketStatus,
                            escalated:
                              v === "Escalated" ? true : ticket.escalated,
                          })
                        }
                        value={ticket.status}
                      >
                        <SelectTrigger aria-label="Status" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectPopup>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    ),
                  },
                  {
                    label: "Priority",
                    node: (
                      <Select
                        onValueChange={(v) =>
                          patchTicket(ticket.id, { priority: v as Priority })
                        }
                        value={ticket.priority}
                      >
                        <SelectTrigger aria-label="Priority" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectPopup>
                          {priorities.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    ),
                  },
                  {
                    label: "Assignee",
                    node: (
                      <Select
                        onValueChange={(v) =>
                          patchTicket(ticket.id, { assignee: v as string })
                        }
                        value={agent ? ticket.assignee : ""}
                      >
                        <SelectTrigger aria-label="Assignee" className="w-full">
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectPopup>
                          {agents.map((a) => (
                            <SelectItem key={a.id} value={a.name}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    ),
                  },
                  {
                    label: "Channel",
                    node: (
                      <Select
                        onValueChange={(v) =>
                          patchTicket(ticket.id, { channel: v as Channel })
                        }
                        value={ticket.channel}
                      >
                        <SelectTrigger aria-label="Channel" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectPopup>
                          {channels.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    ),
                  },
                ] as const
              ).map((row) => (
                <div className="flex flex-col gap-1.5" key={row.label}>
                  <span className="font-medium text-muted-foreground text-xs leading-none">
                    {row.label}
                  </span>
                  {row.node}
                </div>
              ))}
              <div className="flex items-center justify-between border-black/[0.06] border-t pt-3">
                <span className="font-medium text-muted-foreground text-xs leading-none">
                  SLA due in
                </span>
                <span
                  className={cn(
                    "font-semibold text-[13px] leading-none tabular-nums",
                    overdue ? "text-destructive" : "text-foreground",
                  )}
                >
                  {slaLabel(ticket.slaHours)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs leading-none">
                  Created
                </span>
                <span className="text-[13px] text-foreground leading-none tabular-nums">
                  {ticket.created}
                </span>
              </div>
            </div>
          </Panel>

          {client && (
            <Panel
              className="animate-rise [animation-delay:200ms]"
              patternStyle={{
                left: "calc(50% - 28.5px)",
                top: "calc(50% + 58.5px)",
                transform: "translate(-50%, -50%)",
              }}
            >
              <PanelHeader>
                <div className="flex items-center gap-3">
                  <Icon name="user-account" />
                  <PanelTitle>Client</PanelTitle>
                </div>
              </PanelHeader>
              <button
                className="flex w-full items-center gap-2.5 rounded-xl bg-card p-3.5 text-left shadow-[inset_0_0_0_0.8px_var(--input)] outline-none transition-shadow hover:bg-[#fafafa] focus-visible:ring-[3px] focus-visible:ring-ring/40"
                onClick={() =>
                  navigate({ name: "client-detail", clientId: client.id })
                }
                type="button"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {initials(client.company)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-1 flex-col gap-1 leading-none">
                  <span className="truncate font-medium text-[13px] text-foreground">
                    {client.company}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    {client.contact} · {client.plan}
                  </span>
                </span>
                <Icon name="chevron-selector" size={14} />
              </button>
            </Panel>
          )}
        </div>
      </div>
      <ConfirmDialog
        description={`Ticket ${ticket.id} “${ticket.subject}” and its ${ticket.messages.length} messages will be permanently deleted.`}
        onConfirm={() => {
          deleteTicket(ticket.id);
          navigate({ name: "tickets" });
        }}
        onOpenChange={setConfirmDelete}
        open={confirmDelete}
        title="Delete this ticket?"
      />
    </>
  );
}
