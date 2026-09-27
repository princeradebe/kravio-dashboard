import { useState } from "react";
import type * as React from "react";
import { useStore } from "@/lib/store";
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
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
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

const reportTypes = ["Ticket Volume", "SLA Compliance", "CSAT Summary", "Agent Workload"] as const;
const periods = ["Last week", "Last month", "Last quarter"] as const;

function downloadCsv(name: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  Object.assign(document.createElement("a"), {
    href: url,
    download: `${name.toLowerCase().replace(/\s+/g, "-")}.csv`,
  }).click();
  URL.revokeObjectURL(url);
}

function NewReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  const { addReport } = useStore();
  const [name, setName] = useState("");
  const [type, setType] = useState<(typeof reportTypes)[number]>("Ticket Volume");
  const [period, setPeriod] = useState<(typeof periods)[number]>("Last week");
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim()) {
      setError("Name the report");
      return;
    }
    addReport({ name: name.trim(), type, period });
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup className="max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Builds instantly from live queue data — ready to download.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="font-medium text-[13px] text-secondary-foreground leading-none"
              htmlFor="rp-name"
            >
              Report name
            </label>
            <Input
              aria-describedby={error ? "rp-name-err" : undefined}
              aria-invalid={!!error}
              autoFocus
              id="rp-name"
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              placeholder="e.g. September SLA Review"
              value={name}
            />
            {error && (
              <p
                className="text-destructive text-xs leading-none"
                id="rp-name-err"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="rp-type"
              >
                Type
              </label>
              <Select
                onValueChange={(v) => setType(v as typeof type)}
                value={type}
              >
                <SelectTrigger aria-label="Report type" id="rp-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {reportTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="rp-period"
              >
                Period
              </label>
              <Select
                onValueChange={(v) => setPeriod(v as typeof period)}
                value={period}
              >
                <SelectTrigger aria-label="Period" id="rp-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
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
          <Button onClick={submit}>Generate</Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

export function ReportsScreen(): React.ReactElement {
  const { reports, tickets, feedback } = useStore();
  const [open, setOpen] = useState(false);

  const exportReport = (type: string) => {
    if (type === "Ticket Volume") {
      downloadCsv(
        "ticket-volume",
        [["ID", "Subject", "Status", "Priority", "Created"]].concat(
          tickets.map((t) => [t.id, t.subject, t.status, t.priority, t.created]),
        ),
      );
    } else if (type === "CSAT Summary") {
      downloadCsv(
        "csat-summary",
        [["User", "Rating", "Ticket", "Comment"]].concat(
          feedback.map((f) => [f.user, String(f.rating), f.ticketId, f.comment]),
        ),
      );
    } else {
      downloadCsv(
        type.toLowerCase(),
        [["ID", "Subject", "Status", "SLA Hours"]].concat(
          tickets.map((t) => [t.id, t.subject, t.status, String(t.slaHours)]),
        ),
      );
    }
  };

  return (
    <>
      <ScreenHeader
        actions={
          <Button onClick={() => setOpen(true)}>
            <Icon name="sb-file" />
            New Report
          </Button>
        }
        description="Generated exports and scheduled digests."
        title="Reports"
      />
      <Panel
        aria-label="Reports"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader>
          <div className="flex items-center gap-3">
            <Icon name="sb-file" />
            <PanelTitle>All Reports</PanelTitle>
          </div>
        </PanelHeader>
        <div className="flex flex-col gap-1.5 rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
          {reports.map((r, i) => (
            <div
              className="group/row flex animate-rise items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/60"
              key={r.id}
              style={{ animationDelay: `${140 + i * 30}ms` }}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon name="sb-file" size={14} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1 leading-none">
                <span className="truncate font-medium text-[13px] text-foreground">
                  {r.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  {r.type} · {r.period}
                </span>
              </div>
              <Badge variant={r.status === "Ready" ? "success" : "secondary"}>
                {r.status}
              </Badge>
              <span className="hidden w-24 text-right text-muted-foreground text-xs leading-none tabular-nums sm:block">
                {r.created}
              </span>
              <Menu>
                <MenuTrigger
                  render={
                    <Button
                      aria-label={`Actions for ${r.name}`}
                      className="data-[popup-open]:bg-black/[0.05]"
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Icon name="more" />
                    </Button>
                  }
                />
                <MenuPopup align="end">
                  <MenuGroup>
                    <MenuItem
                      disabled={r.status !== "Ready"}
                      onClick={() => exportReport(r.type)}
                    >
                      Download CSV
                    </MenuItem>
                    <MenuItem onClick={() => exportReport(r.type)}>
                      Regenerate
                    </MenuItem>
                  </MenuGroup>
                </MenuPopup>
              </Menu>
            </div>
          ))}
          {reports.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Icon className="opacity-50" name="sb-file" />
                </EmptyMedia>
                <EmptyTitle>No reports yet</EmptyTitle>
                <EmptyDescription>
                  Generate one to download queue data as CSV.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </Panel>
      <NewReportDialog onOpenChange={setOpen} open={open} />
    </>
  );
}
