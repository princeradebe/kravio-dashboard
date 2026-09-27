import { useMemo, useState } from "react";
import type * as React from "react";
import { asset } from "@/lib/assets";
import { useNav } from "@/lib/nav";
import { initials, useStore, type Agent, type Availability } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";
import { AvailabilityDot, availabilityLabel } from "@/components/badges";

const agentTabs = [
  { id: "all-agents", label: "All Agents" },
  { id: "teams", label: "Teams" },
  { id: "schedules", label: "Shift Schedules" },
] as const;

type AgentTab = (typeof agentTabs)[number]["id"];

const availabilities: Availability[] = ["online", "busy", "offline"];

function AddAgentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  const { agents, addAgent } = useStore();
  const teams = useMemo(() => [...new Set(agents.map((a) => a.team))], [agents]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Support Agent");
  const [team, setTeam] = useState(teams[0] ?? "Tier 1");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length) return;
    addAgent({
      name: name.trim(),
      email: email.trim(),
      role,
      team,
      avatar: null,
      availability: "offline",
      resolvedWeek: 0,
      csat: 0,
    });
    setName("");
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup className="max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Add Agent</DialogTitle>
          <DialogDescription>
            Invite a teammate — they start offline until they sign in.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="font-medium text-[13px] text-secondary-foreground leading-none"
              htmlFor="ag-name"
            >
              Full name
            </label>
            <Input
              aria-describedby={errors.name ? "ag-name-err" : undefined}
              aria-invalid={!!errors.name}
              autoFocus
              id="ag-name"
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim())
                  setErrors(({ name: _n, ...rest }) => rest);
              }}
              placeholder="Jordan Rivera"
              value={name}
            />
            {errors.name && (
              <p
                className="text-destructive text-xs leading-none"
                id="ag-name-err"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="font-medium text-[13px] text-secondary-foreground leading-none"
              htmlFor="ag-email"
            >
              Email
            </label>
            <Input
              aria-describedby={errors.email ? "ag-email-err" : undefined}
              aria-invalid={!!errors.email}
              id="ag-email"
              onChange={(e) => {
                setEmail(e.target.value);
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value))
                  setErrors(({ email: _e, ...rest }) => rest);
              }}
              placeholder="name@kravio.io"
              type="email"
              value={email}
            />
            {errors.email && (
              <p
                className="text-destructive text-xs leading-none"
                id="ag-email-err"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="ag-role"
              >
                Role
              </label>
              <Input
                id="ag-role"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="ag-team"
              >
                Team
              </label>
              <Select onValueChange={(v) => setTeam(v as string)} value={team}>
                <SelectTrigger aria-label="Team" id="ag-team">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {teams.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
          </div>
        </DialogPanel>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={submit}>Add Agent</Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const { patchAgent, tickets } = useStore();
  const assigned = tickets.filter(
    (t) =>
      t.assignee === agent.name &&
      t.status !== "Delivered" &&
      t.status !== "Closed",
  ).length;
  const capacity = Math.min(100, Math.round((assigned / 8) * 100));

  return (
    <div
      className="flex animate-rise flex-col gap-3 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_0_0_0.8px_var(--input)]"
      style={{ animationDelay: `${120 + index * 40}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex shrink-0">
          <Avatar className="size-9">
            {agent.avatar ? (
              <AvatarImage alt="" src={asset(agent.avatar)} />
            ) : null}
            <AvatarFallback className="text-xs">
              {initials(agent.name)}
            </AvatarFallback>
          </Avatar>
          <AvailabilityDot
            availability={agent.availability}
            className="absolute -right-0.5 -bottom-0.5 size-2.5 ring-2 ring-card"
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1 leading-none">
          <span className="truncate font-medium text-[13px] text-foreground">
            {agent.name}
          </span>
          <span className="truncate text-muted-foreground text-xs">
            {agent.role}
          </span>
        </div>
        <Badge variant="outline">{agent.team}</Badge>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs leading-none">
          <span className="font-medium text-muted-foreground">
            Open tickets
          </span>
          <span className="font-medium text-foreground tabular-nums">
            {assigned}
          </span>
        </div>
        <Progress
          aria-label={`${agent.name} workload`}
          value={capacity}
        >
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-muted-foreground text-xs leading-none">
          <span className="tabular-nums">{agent.resolvedWeek}/wk</span>
          {agent.csat > 0 && (
            <span className="flex items-center gap-1 tabular-nums">
              <Icon name="feed-star" size={11} />
              {agent.csat.toFixed(1)}
            </span>
          )}
        </div>
        <Select
          onValueChange={(v) =>
            patchAgent(agent.id, { availability: v as Availability })
          }
          value={agent.availability}
        >
          <SelectTrigger
            aria-label={`${agent.name} availability`}
            className="h-7 w-[104px] text-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {availabilities.map((a) => (
              <SelectItem key={a} value={a}>
                <span className="flex items-center gap-1.5">
                  <AvailabilityDot availability={a} />
                  {availabilityLabel(a)}
                </span>
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
    </div>
  );
}

export function AgentsScreen({ tab }: { tab?: string }): React.ReactElement {
  const { agents, tickets } = useStore();
  const { navigate } = useNav();
  const activeTab: AgentTab =
    (agentTabs.find((t) => t.id === tab)?.id ?? "all-agents") as AgentTab;
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filter = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      agents.filter(
        (a) =>
          !filter ||
          `${a.name} ${a.role} ${a.team}`.toLowerCase().includes(filter),
      ),
    [agents, filter],
  );

  const teams = useMemo(() => {
    const map = new Map<string, Agent[]>();
    for (const a of agents) {
      map.set(a.team, [...(map.get(a.team) ?? []), a]);
    }
    return [...map.entries()];
  }, [agents]);

  return (
    <>
      <ScreenHeader
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Icon name="user-group" />
            Add Agent
          </Button>
        }
        description="Roster, coverage, and availability."
        title="Agents & Teams"
      />
      <Panel
        aria-label="Agents and teams"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader className="flex-wrap gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-3">
            <Icon name="user-group" />
            <PanelTitle>
              {agentTabs.find((t) => t.id === activeTab)?.label}
            </PanelTitle>
          </div>
          <div className="flex w-full items-start gap-2 sm:w-auto">
            <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
              {agentTabs.map((t) => (
                <button
                  aria-current={activeTab === t.id ? "true" : undefined}
                  className={cn(
                    "h-7 whitespace-nowrap rounded-md px-2.5 text-xs leading-none outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    activeTab === t.id
                      ? "bg-card font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  key={t.id}
                  onClick={() => navigate({ name: "agents", tab: t.id })}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
            {activeTab === "all-agents" && (
              <InputGroup className="h-8 min-w-0 flex-1 border-input shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)] sm:w-[200px] sm:flex-none">
                <Icon name="tb-search" />
                <InputGroupInput
                  aria-label="Search agents"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Agent"
                  type="search"
                  value={query}
                />
              </InputGroup>
            )}
          </div>
        </PanelHeader>
        <div className="rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
          {activeTab === "all-agents" && (
            <>
              {visible.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <Icon className="opacity-50" name="user-group" />
                    </EmptyMedia>
                    <EmptyTitle>No agents match</EmptyTitle>
                    <EmptyDescription>Adjust the search.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 p-1.5 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((a, i) => (
                    <AgentCard agent={a} index={i} key={a.id} />
                  ))}
                </div>
              )}
            </>
          )}
          {activeTab === "teams" && (
            <div className="flex flex-col gap-3 p-2.5">
              {teams.map(([team, members], i) => {
                const teamTickets = tickets.filter(
                  (t) =>
                    members.some((m) => m.name === t.assignee) &&
                    t.status !== "Delivered" &&
                    t.status !== "Closed",
                );
                return (
                  <div
                    className="flex animate-rise flex-col gap-2.5 rounded-xl bg-secondary/60 p-3.5"
                    key={team}
                    style={{ animationDelay: `${120 + i * 40}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[13px] text-foreground leading-none">
                        {team}
                      </span>
                      <span className="text-muted-foreground text-xs leading-none tabular-nums">
                        {members.length} agents · {teamTickets.length} open
                        tickets
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {members.map((m) => (
                        <span
                          className="flex items-center gap-1.5 rounded-full bg-card py-1 pr-2.5 pl-1 text-xs leading-none shadow-[inset_0_0_0_0.8px_var(--input)]"
                          key={m.id}
                        >
                          <span className="relative flex">
                            <Avatar className="size-5">
                              {m.avatar ? (
                                <AvatarImage alt="" src={asset(m.avatar)} />
                              ) : null}
                              <AvatarFallback className="text-[8px]">
                                {initials(m.name)}
                              </AvatarFallback>
                            </Avatar>
                            <AvailabilityDot
                              availability={m.availability}
                              className="absolute -right-0.5 -bottom-0.5 size-2 ring-2 ring-card"
                            />
                          </span>
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {activeTab === "schedules" && (
            <div className="flex flex-col p-2.5">
              <div className="grid grid-cols-[minmax(160px,1fr)_repeat(7,80px)] gap-px overflow-x-auto rounded-lg border-[0.8px] border-black/[0.04] bg-black/[0.03] min-w-[860px]">
                <div className="bg-secondary px-3 py-2 font-medium text-[13px] text-secondary-foreground leading-none">
                  Agent
                </div>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div
                    className="bg-secondary px-2 py-2 text-center font-medium text-xs text-secondary-foreground leading-none"
                    key={d}
                  >
                    {d}
                  </div>
                ))}
                {agents.map((a, i) => (
                  <ScheduleRow agent={a} index={i} key={a.id} />
                ))}
              </div>
              <p className="mt-2.5 text-muted-foreground text-xs">
                Tier 1 covers business hours; Tier 2 covers escalations and
                weekends.
              </p>
            </div>
          )}
        </div>
      </Panel>
      <AddAgentDialog onOpenChange={setAddOpen} open={addOpen} />
    </>
  );
}

function ScheduleRow({ agent, index }: { agent: Agent; index: number }) {
  const tier1 = agent.team === "Tier 1";
  const days = tier1
    ? ["09–18", "09–18", "09–18", "09–18", "09–18", "—", "—"]
    : ["10–19", "10–19", "10–19", "10–19", "—", "12–18", "12–18"];
  return (
    <>
      <div
        className="flex animate-fade items-center gap-2 bg-card px-3 py-2"
        style={{ animationDelay: `${140 + index * 30}ms` }}
      >
        <AvailabilityDot availability={agent.availability} />
        <span className="truncate font-medium text-[13px] text-foreground leading-none">
          {agent.name}
        </span>
      </div>
      {days.map((d, i) => (
        <div
          className={cn(
            "bg-card px-2 py-2 text-center text-xs leading-none tabular-nums",
            d === "—" ? "text-muted-foreground/50" : "text-foreground",
          )}
          key={i}
        >
          {d}
        </div>
      ))}
    </>
  );
}
