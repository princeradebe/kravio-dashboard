import { useMemo, useState } from "react";
import type * as React from "react";
import { asset } from "@/lib/assets";
import { priorityIcons, slaLabel, statusIcons } from "@/lib/data";
import { useNav } from "@/lib/nav";
import {
  initials,
  useStore,
  type Channel,
  type Priority,
  type Ticket,
  type TicketStatus,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TicketStatusBadge, PriorityBadge } from "@/components/badges";

const ticketGridCols =
  "grid grid-cols-[120px_minmax(200px,1fr)_120px_150px_130px_120px_120px_40px]";
const cellClasses = "flex h-full min-w-0 items-center px-3 py-2.5";
const cellTextClasses =
  "truncate text-[13px] font-medium leading-none text-cell-foreground";

const ticketTabs = [
  { id: "queue", label: "All / My Queue" },
  { id: "sla-risk", label: "SLA Breach Risk" },
  { id: "escalations", label: "Escalations" },
] as const;

type TicketTab = (typeof ticketTabs)[number]["id"];

const channels: Channel[] = ["Email", "Chat", "Form", "Phone"];
const priorities: Priority[] = ["High", "Medium", "Low"];
const statuses: TicketStatus[] = [
  "In Review",
  "In Progress",
  "Delivered",
  "Escalated",
  "Closed",
];

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className="font-medium text-[13px] text-secondary-foreground leading-none"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

function NewTicketDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  const { clients, agents, addTicket } = useStore();
  const { navigate } = useNav();
  const [subject, setSubject] = useState("");
  const [clientId, setClientId] = useState<string>(clients[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [channel, setChannel] = useState<Channel>("Email");
  const [assignee, setAssignee] = useState<string>(agents[0]?.name ?? "");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const next: Record<string, string> = {};
    if (!subject.trim()) next.subject = "Subject is required";
    if (!clientId) next.client = "Choose a client";
    if (!body.trim()) next.body = "Describe the request";
    setErrors(next);
    if (Object.keys(next).length) return;
    const ticket = addTicket({
      subject: subject.trim(),
      priority,
      status: "In Review",
      assignee: assignee || "Unassigned",
      clientId,
      channel,
      created: new Date().toISOString().slice(0, 10),
      slaHours: priority === "High" ? 4 : priority === "Medium" ? 12 : 48,
      firstMessage: body.trim(),
    });
    onOpenChange(false);
    setSubject("");
    setBody("");
    navigate({ name: "ticket-detail", ticketId: ticket.id });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup className="max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>New Ticket</DialogTitle>
          <DialogDescription>
            Log a customer request — it lands in the queue immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="nt-subject">Subject</FieldLabel>
            <Input
              aria-describedby={errors.subject ? "nt-subject-err" : undefined}
              aria-invalid={!!errors.subject}
              autoFocus
              id="nt-subject"
              onBlur={() => {
                if (!subject.trim())
                  setErrors((e) => ({ ...e, subject: "Subject is required" }));
              }}
              onChange={(e) => {
                setSubject(e.target.value);
                if (e.target.value.trim())
                  setErrors(({ subject: _s, ...rest }) => rest);
              }}
              placeholder="e.g. Payment failed on invoice"
              value={subject}
            />
            {errors.subject && (
              <p
                className="text-destructive text-xs leading-none"
                id="nt-subject-err"
                role="alert"
              >
                {errors.subject}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="nt-client">Client</FieldLabel>
              <Select onValueChange={(v) => setClientId(v as string)} value={clientId}>
                <SelectTrigger aria-label="Client" id="nt-client">
                  <SelectValue placeholder="Choose client" />
                </SelectTrigger>
                <SelectPopup>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.company}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
              {errors.client && (
                <p className="text-destructive text-xs leading-none" role="alert">
                  {errors.client}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="nt-priority">Priority</FieldLabel>
              <Select
                onValueChange={(v) => setPriority(v as Priority)}
                value={priority}
              >
                <SelectTrigger aria-label="Priority" id="nt-priority">
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
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="nt-channel">Channel</FieldLabel>
              <Select
                onValueChange={(v) => setChannel(v as Channel)}
                value={channel}
              >
                <SelectTrigger aria-label="Channel" id="nt-channel">
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
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="nt-assignee">Assignee</FieldLabel>
              <Select
                onValueChange={(v) => setAssignee(v as string)}
                value={assignee}
              >
                <SelectTrigger aria-label="Assignee" id="nt-assignee">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="nt-body">Description</FieldLabel>
            <Textarea
              aria-describedby={errors.body ? "nt-body-err" : undefined}
              aria-invalid={!!errors.body}
              id="nt-body"
              onChange={(e) => {
                setBody(e.target.value);
                if (e.target.value.trim())
                  setErrors(({ body: _b, ...rest }) => rest);
              }}
              placeholder="What did the customer report?"
              rows={4}
              value={body}
            />
            {errors.body && (
              <p
                className="text-destructive text-xs leading-none"
                id="nt-body-err"
                role="alert"
              >
                {errors.body}
              </p>
            )}
          </div>
        </DialogPanel>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={submit}>Create Ticket</Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

function TicketRow({
  ticket,
  index,
}: {
  ticket: Ticket;
  index: number;
}): React.ReactElement {
  const { agents, patchTicket, deleteTicket, clients } = useStore();
  const { navigate } = useNav();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const client = clients.find((c) => c.id === ticket.clientId);
  const agent = agents.find((a) => a.name === ticket.assignee);
  const overdue = ticket.slaHours < 0;

  return (
    <div
      className={cn(
        ticketGridCols,
        "group/row h-[45.75px] animate-rise cursor-pointer border-black/[0.06] border-b bg-card transition-colors duration-150 hover:bg-[#fafafa]",
      )}
      onClick={(e) => {
        const el = e.target as HTMLElement;
        if (el.closest("button, [role=checkbox], a, [role=combobox]")) return;
        navigate({ name: "ticket-detail", ticketId: ticket.id });
      }}
      role="row"
      style={{ animationDelay: `${120 + index * 40}ms` }}
    >
      <div className={cn(cellClasses, "gap-2")} role="cell">
        <span className="whitespace-nowrap font-medium text-[13px] text-cell-foreground leading-none tabular-nums">
          {ticket.id}
        </span>
      </div>
      <div className={cn(cellClasses, "flex-col items-start justify-center gap-1")} role="cell">
        <button
          aria-label={`Open ticket ${ticket.id}: ${ticket.subject}`}
          className={cn(
            cellTextClasses,
            "w-full rounded text-left underline-offset-2 outline-none transition-colors hover:underline group-hover/row:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
          )}
          onClick={() =>
            navigate({ name: "ticket-detail", ticketId: ticket.id })
          }
          type="button"
        >
          {ticket.subject}
        </button>
        {client && (
          <span className="truncate text-[11px] text-muted-foreground leading-none">
            {client.company}
          </span>
        )}
      </div>
      <div className={cn(cellClasses, "gap-2")} role="cell">
        <Icon name={priorityIcons[ticket.priority]} />
        <PriorityBadge className="hidden xl:inline-flex" priority={ticket.priority} />
        <span className={cn(cellTextClasses, "xl:hidden")}>{ticket.priority}</span>
      </div>
      <div className={cn(cellClasses, "gap-2")} role="cell">
        <Avatar className="size-5 transition-transform duration-200 group-hover/row:scale-110">
          {agent?.avatar ? (
            <AvatarImage alt="" height={20} src={asset(agent.avatar)} width={20} />
          ) : null}
          <AvatarFallback className="text-[9px]">
            {initials(ticket.assignee)}
          </AvatarFallback>
        </Avatar>
        <span className={cn(cellTextClasses, "flex-1")}>{ticket.assignee}</span>
      </div>
      <div className={cn(cellClasses, "gap-2")} role="cell">
        <span className="flex animate-pop" key={ticket.status}>
          <Icon name={statusIcons[ticket.status]} />
        </span>
        <TicketStatusBadge status={ticket.status} />
      </div>
      <div className={cellClasses} role="cell">
        <span className={cn(cellTextClasses, "flex-1 tabular-nums")}>
          {ticket.created}
        </span>
      </div>
      <div className={cellClasses} role="cell">
        <span
          className={cn(
            cellTextClasses,
            "flex-1 tabular-nums",
            overdue && "font-semibold text-destructive",
            !overdue && ticket.slaHours <= 4 && "text-warning-foreground",
          )}
        >
          {slaLabel(ticket.slaHours)}
        </span>
      </div>
      <div
        className="flex h-full items-center justify-center py-2.5"
        role="cell"
      >
        <Menu>
          <MenuTrigger
            render={
              <Button
                aria-label={`Actions for ${ticket.id}`}
                className="data-[popup-open]:bg-black/[0.05]"
                size="icon-sm"
                variant="ghost"
              >
                <Icon name="more" />
              </Button>
            }
          />
          <MenuPopup align="end" className="w-52">
            <MenuGroup>
              <MenuGroupLabel>{ticket.id}</MenuGroupLabel>
              <MenuItem
                onClick={() =>
                  navigate({ name: "ticket-detail", ticketId: ticket.id })
                }
              >
                <Icon name="tb-search" />
                Open ticket
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Set Status</MenuGroupLabel>
              <MenuRadioGroup
                onValueChange={(v) =>
                  patchTicket(ticket.id, {
                    status: v as TicketStatus,
                    escalated: v === "Escalated" ? true : ticket.escalated,
                  })
                }
                value={ticket.status}
              >
                {statuses.map((s) => (
                  <MenuRadioItem closeOnClick key={s} value={s}>
                    <Icon name={statusIcons[s]} />
                    {s}
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Reassign</MenuGroupLabel>
              {agents.map((a) => (
                <MenuItem
                  disabled={ticket.assignee === a.name}
                  key={a.id}
                  onClick={() => patchTicket(ticket.id, { assignee: a.name })}
                >
                  {a.avatar ? (
                    <img
                      alt=""
                      className="size-4 rounded-full"
                      height={16}
                      src={asset(a.avatar)}
                      width={16}
                    />
                  ) : (
                    <span className="flex size-4 items-center justify-center rounded-full bg-secondary font-medium text-[8px] text-secondary-foreground">
                      {initials(a.name)}
                    </span>
                  )}
                  {a.name}
                </MenuItem>
              ))}
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuItem
                disabled={ticket.escalated}
                onClick={() =>
                  patchTicket(ticket.id, {
                    escalated: true,
                    status: "Escalated",
                  })
                }
              >
                <Icon name="feed-alert" />
                Escalate
              </MenuItem>
              <MenuItem
                className="text-destructive data-highlighted:bg-destructive/8 data-highlighted:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                Delete ticket
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>
        <ConfirmDialog
          description={`Ticket ${ticket.id} “${ticket.subject}” will be permanently removed from the queue.`}
          onConfirm={() => deleteTicket(ticket.id)}
          onOpenChange={setConfirmDelete}
          open={confirmDelete}
          title="Delete this ticket?"
        />
      </div>
    </div>
  );
}

export function TicketsScreen({
  tab,
}: {
  tab?: string;
}): React.ReactElement {
  const { tickets, settings } = useStore();
  const { navigate } = useNav();
  const activeTab: TicketTab =
    (ticketTabs.find((t) => t.id === tab)?.id ?? "queue") as TicketTab;
  const [queueScope, setQueueScope] = useState<string[]>(["all"]);
  const [query, setQuery] = useState("");
  const [prioritiesFilter, setPrioritiesFilter] = useState<Set<Priority>>(
    new Set(),
  );
  const [statusesFilter, setStatusesFilter] = useState<Set<TicketStatus>>(
    new Set(),
  );
  const [newOpen, setNewOpen] = useState(false);

  const filter = query.trim().toLowerCase();
  const visible = useMemo(() => {
    let list = tickets;
    if (activeTab === "sla-risk") {
      list = list.filter(
        (t) =>
          t.slaHours <= 8 && t.status !== "Delivered" && t.status !== "Closed",
      );
    } else if (activeTab === "escalations") {
      list = list.filter((t) => t.escalated || t.status === "Escalated");
    } else if (queueScope[0] === "mine") {
      list = list.filter((t) => t.assignee === settings.agentName);
    }
    return list.filter(
      (t) =>
        (!filter ||
          `${t.id} ${t.subject} ${t.assignee}`.toLowerCase().includes(filter)) &&
        (!prioritiesFilter.size || prioritiesFilter.has(t.priority)) &&
        (!statusesFilter.size || statusesFilter.has(t.status)),
    );
  }, [tickets, activeTab, queueScope, settings.agentName, filter, prioritiesFilter, statusesFilter]);

  const filterCount = prioritiesFilter.size + statusesFilter.size;
  const toggleSet = <T,>(
    set: React.Dispatch<React.SetStateAction<Set<T>>>,
    value: T,
  ) =>
    set((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  return (
    <>
      <ScreenHeader
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Icon name="sb-ticket" />
            New Ticket
          </Button>
        }
        description="Every conversation, in one queue."
        title="Tickets"
      />
      <Panel
        aria-label="Tickets"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader className="flex-wrap gap-2 lg:flex-nowrap">
          <div className="flex items-center gap-3">
            <Icon name="sb-ticket" />
            <PanelTitle>
              {ticketTabs.find((t) => t.id === activeTab)?.label}
            </PanelTitle>
          </div>
          <div className="flex w-full flex-wrap items-start gap-2 lg:w-auto lg:flex-nowrap">
            <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
              {ticketTabs.map((t) => (
                <button
                  aria-current={activeTab === t.id ? "true" : undefined}
                  className={cn(
                    "h-7 whitespace-nowrap rounded-md px-2.5 text-xs leading-none outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    activeTab === t.id
                      ? "bg-card font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  key={t.id}
                  onClick={() => navigate({ name: "tickets", tab: t.id })}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
            {activeTab === "queue" && (
              <ToggleGroup
                aria-label="Queue scope"
                className="h-8"
                onValueChange={(v) => v.length && setQueueScope(v)}
                value={queueScope}
              >
                <ToggleGroupItem value="all">All</ToggleGroupItem>
                <ToggleGroupItem value="mine">My Queue</ToggleGroupItem>
              </ToggleGroup>
            )}
            <InputGroup className="h-8 min-w-0 flex-1 border-input shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)] lg:w-[200px] lg:flex-none">
              <Icon name="tb-search" />
              <InputGroupInput
                aria-label="Search tickets"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ticket"
                type="search"
                value={query}
              />
            </InputGroup>
            <Menu>
              <MenuTrigger
                render={
                  <Button
                    className="group/f h-8 gap-1.5 pr-2.5 pl-2"
                    variant="surface"
                  />
                }
              >
                <Icon name="filter" />
                Filter
                {filterCount > 0 && (
                  <span className="-mr-1 ml-0.5 flex size-4 animate-pop items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground leading-none tabular-nums">
                    {filterCount}
                  </span>
                )}
              </MenuTrigger>
              <MenuPopup align="end" className="w-48">
                <MenuGroup>
                  <MenuGroupLabel>Priority</MenuGroupLabel>
                  {priorities.map((p) => (
                    <MenuCheckboxItem
                      checked={prioritiesFilter.has(p)}
                      key={p}
                      onCheckedChange={() => toggleSet(setPrioritiesFilter, p)}
                    >
                      <Icon name={priorityIcons[p]} />
                      {p}
                    </MenuCheckboxItem>
                  ))}
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup>
                  <MenuGroupLabel>Status</MenuGroupLabel>
                  {statuses.map((s) => (
                    <MenuCheckboxItem
                      checked={statusesFilter.has(s)}
                      key={s}
                      onCheckedChange={() => toggleSet(setStatusesFilter, s)}
                    >
                      <Icon name={statusIcons[s]} />
                      {s}
                    </MenuCheckboxItem>
                  ))}
                </MenuGroup>
                {filterCount > 0 && (
                  <>
                    <MenuSeparator />
                    <MenuItem
                      onClick={() => {
                        setPrioritiesFilter(new Set());
                        setStatusesFilter(new Set());
                      }}
                    >
                      Clear filters
                    </MenuItem>
                  </>
                )}
              </MenuPopup>
            </Menu>
          </div>
        </PanelHeader>
        <div className="relative w-full overflow-x-auto rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)] [scrollbar-width:thin]">
          <div
            aria-label="Ticket list"
            aria-rowcount={visible.length + 1}
            className="min-w-[1020px]"
            role="table"
          >
            <div
              className={cn(
                ticketGridCols,
                "h-9 rounded-lg border-[0.8px] border-black/[0.04] bg-secondary",
              )}
              role="row"
            >
              {[
                "Ticket ID",
                "Subject",
                "Priority",
                "Assigned To",
                "Status",
                "Created",
                "SLA Due",
              ].map((label, i) => (
                <div
                  className={cn(
                    "flex h-full items-center px-3 py-2.5",
                    i === 0 && "pl-3",
                  )}
                  key={label}
                  role="columnheader"
                >
                  <span className="whitespace-nowrap text-[13px] text-secondary-foreground leading-none">
                    {label}
                  </span>
                </div>
              ))}
              <div role="columnheader" />
            </div>
            <div role="rowgroup">
              {visible.map((t, i) => (
                <TicketRow index={i} key={t.id} ticket={t} />
              ))}
              {visible.length === 0 && (
                <div
                  className="flex h-[183px] animate-fade flex-col items-center justify-center gap-1.5 text-center"
                  role="row"
                >
                  <Icon className="opacity-50" name="tb-search" />
                  <p className="font-medium text-[13px] text-foreground">
                    No tickets match
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {activeTab === "escalations"
                      ? "No escalated tickets — nice and calm."
                      : "Adjust the search or filters."}
                  </p>
                  {filterCount + (query ? 1 : 0) > 0 && (
                    <Button
                      className="mt-1"
                      onClick={() => {
                        setQuery("");
                        setPrioritiesFilter(new Set());
                        setStatusesFilter(new Set());
                      }}
                      size="sm"
                      variant="surface"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>
      <NewTicketDialog onOpenChange={setNewOpen} open={newOpen} />
    </>
  );
}
