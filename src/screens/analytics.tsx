import { useMemo } from "react";
import type * as React from "react";
import { slaLabel } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";

function StatCard({
  label,
  value,
  hint,
  icon,
  delay,
}: {
  label: string;
  value: string;
  hint: string;
  icon: string;
  delay: number;
}) {
  return (
    <div
      className="flex animate-rise flex-col gap-2.5 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground text-xs leading-none">
          {label}
        </span>
        <Icon className="opacity-60" name={icon} size={14} />
      </div>
      <span className="font-medium text-2xl text-foreground leading-none tabular-nums">
        {value}
      </span>
      <span className="text-muted-foreground text-xs leading-none">{hint}</span>
    </div>
  );
}

function Bar({ label, value, max, format, danger }: { label: string; value: number; max: number; format?: (v: number) => string; danger?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate font-medium text-[13px] text-secondary-foreground leading-none">
        {label}
      </span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-expo)]",
            danger ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${max ? Math.min(100, (value / max) * 100) : 0}%` }}
        />
      </div>
      <span className="w-16 shrink-0 text-right font-medium text-[13px] text-foreground leading-none tabular-nums">
        {format ? format(value) : value}
      </span>
    </div>
  );
}

export function SlaComplianceScreen(): React.ReactElement {
  const { tickets } = useStore();
  const stats = useMemo(() => {
    const open = tickets.filter(
      (t) => t.status !== "Delivered" && t.status !== "Closed",
    );
    const breached = open.filter((t) => t.slaHours < 0);
    const atRisk = open.filter((t) => t.slaHours >= 0 && t.slaHours <= 4);
    const resolved = tickets.filter(
      (t) => t.status === "Delivered" || t.status === "Closed",
    );
    const compliance = tickets.length
      ? Math.round(((tickets.length - breached.length) / tickets.length) * 100)
      : 100;
    return { open, breached, atRisk, resolved, compliance };
  }, [tickets]);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tickets) map.set(t.status, (map.get(t.status) ?? 0) + 1);
    return [...map.entries()];
  }, [tickets]);

  return (
    <>
      <ScreenHeader
        description="Response and resolution targets, at a glance."
        title="SLA Compliance"
      />
      <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard delay={80} hint={`of ${tickets.length} tickets within target`} icon="target" label="Compliance" value={`${stats.compliance}%`} />
        <StatCard delay={120} hint="past their SLA deadline" icon="feed-alert" label="Breached" value={String(stats.breached.length)} />
        <StatCard delay={160} hint="under 4h remaining" icon="timer" label="At Risk" value={String(stats.atRisk.length)} />
        <StatCard delay={200} hint="delivered or closed" icon="status-delivered" label="Resolved" value={String(stats.resolved.length)} />
      </div>
      <div className="flex w-full flex-col gap-4 min-[1200px]:flex-row">
        <Panel className="min-w-0 flex-1 animate-rise [animation-delay:200ms]">
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="clock-01" />
              <PanelTitle>Breaches & Near-Breaches</PanelTitle>
            </div>
          </PanelHeader>
          <div className="flex flex-col gap-1.5 rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {[...stats.breached, ...stats.atRisk].map((t) => (
              <div
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                key={t.id}
              >
                <Icon name={t.slaHours < 0 ? "feed-alert" : "timer"} />
                <span className="w-16 shrink-0 font-medium text-[13px] text-cell-foreground leading-none tabular-nums">
                  {t.id}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-foreground leading-none">
                  {t.subject}
                </span>
                <Badge variant={t.slaHours < 0 ? "error" : "warning"}>
                  {slaLabel(t.slaHours)}
                </Badge>
              </div>
            ))}
            {stats.breached.length + stats.atRisk.length === 0 && (
              <div className="flex h-[140px] flex-col items-center justify-center gap-1.5 text-center">
                <Icon className="opacity-50" name="check-tick" />
                <p className="font-medium text-[13px] text-foreground">
                  Nothing at risk
                </p>
                <p className="text-muted-foreground text-xs">
                  Every open ticket is comfortably inside its SLA.
                </p>
              </div>
            )}
          </div>
        </Panel>
        <Panel className="w-full shrink-0 animate-rise [animation-delay:240ms] min-[1200px]:w-[360px]">
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="analytics" />
              <PanelTitle>Tickets by Status</PanelTitle>
            </div>
          </PanelHeader>
          <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {byStatus.map(([status, count]) => (
              <Bar
                key={status}
                label={status}
                max={tickets.length}
                value={count}
              />
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

export function CsatScreen(): React.ReactElement {
  const { feedback, agents } = useStore();
  const stats = useMemo(() => {
    const avg = feedback.length
      ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
      : 0;
    const promoters = feedback.filter((f) => f.rating === 5).length;
    const detractors = feedback.filter((f) => f.rating <= 3).length;
    const nps = feedback.length
      ? Math.round(((promoters - detractors) / feedback.length) * 100)
      : 0;
    const dist = [5, 4, 3, 2, 1].map(
      (r) => [r, feedback.filter((f) => f.rating === r).length] as const,
    );
    return { avg, nps, dist, promoters };
  }, [feedback]);

  return (
    <>
      <ScreenHeader
        description="How customers feel about the support they get."
        title="CSAT & NPS"
      />
      <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard delay={80} hint={`across ${feedback.length} responses`} icon="feed-star" label="CSAT Score" value={stats.avg.toFixed(1)} />
        <StatCard delay={120} hint="promoters minus detractors" icon="analytics" label="NPS" value={String(stats.nps)} />
        <StatCard delay={160} hint="5-star responses" icon="check-tick" label="Promoters" value={String(stats.promoters)} />
        <StatCard delay={200} hint="awaiting a reply" icon="comment" label="Unanswered" value={String(feedback.filter((f) => f.status === "new").length)} />
      </div>
      <div className="flex w-full flex-col gap-4 min-[1200px]:flex-row">
        <Panel className="min-w-0 flex-1 animate-rise [animation-delay:200ms]">
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="feed-star" />
              <PanelTitle>Rating Distribution</PanelTitle>
            </div>
          </PanelHeader>
          <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {stats.dist.map(([rating, count]) => (
              <Bar
                format={(v) => `${v}`}
                key={rating}
                label={`${rating} stars`}
                max={feedback.length}
                value={count}
              />
            ))}
          </div>
        </Panel>
        <Panel className="w-full shrink-0 animate-rise [animation-delay:240ms] min-[1200px]:w-[360px]">
          <PanelHeader>
            <div className="flex items-center gap-3">
              <Icon name="user-group" />
              <PanelTitle>CSAT by Agent</PanelTitle>
            </div>
          </PanelHeader>
          <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
            {agents
              .filter((a) => a.csat > 0)
              .map((a) => (
                <Bar
                  format={(v) => v.toFixed(1)}
                  key={a.id}
                  label={a.name}
                  max={5}
                  value={a.csat}
                />
              ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

export function WorkloadScreen(): React.ReactElement {
  const { agents, tickets } = useStore();
  const rows = useMemo(
    () =>
      agents.map((a) => {
        const open = tickets.filter(
          (t) =>
            t.assignee === a.name &&
            t.status !== "Delivered" &&
            t.status !== "Closed",
        );
        const escalated = open.filter((t) => t.escalated).length;
        return { agent: a, open: open.length, escalated };
      }),
    [agents, tickets],
  );
  const maxOpen = Math.max(1, ...rows.map((r) => r.open));
  const unassigned = tickets.filter(
    (t) =>
      !agents.some((a) => a.name === t.assignee) &&
      t.status !== "Delivered" &&
      t.status !== "Closed",
  ).length;

  return (
    <>
      <ScreenHeader
        description="Where the queue weight sits across the team."
        title="Workload Analytics"
      />
      <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard delay={80} hint="open tickets on the board" icon="sb-ticket" label="Total Open" value={String(rows.reduce((s, r) => s + r.open, 0) + unassigned)} />
        <StatCard delay={120} hint="per agent on average" icon="user-group" label="Avg Load" value={(rows.reduce((s, r) => s + r.open, 0) / Math.max(1, rows.length)).toFixed(1)} />
        <StatCard delay={160} hint="escalated right now" icon="feed-alert" label="Escalations" value={String(rows.reduce((s, r) => s + r.escalated, 0))} />
        <StatCard delay={200} hint="need an assignee" icon="clock-01" label="Unassigned" value={String(unassigned)} />
      </div>
      <Panel className="w-full animate-rise [animation-delay:200ms]">
        <PanelHeader>
          <div className="flex items-center gap-3">
            <Icon name="analytics" />
            <PanelTitle>Open Tickets per Agent</PanelTitle>
          </div>
        </PanelHeader>
        <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
          {rows.map(({ agent, open, escalated }) => (
            <div className="flex items-center gap-3" key={agent.id}>
              <span className="w-28 shrink-0 truncate font-medium text-[13px] text-secondary-foreground leading-none">
                {agent.name}
              </span>
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[var(--ease-out-expo)]"
                  style={{ width: `${(open / maxOpen) * 100}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right font-medium text-[13px] text-foreground leading-none tabular-nums">
                {open}
                {escalated > 0 && (
                  <span className="ml-1 text-destructive">({escalated})</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
