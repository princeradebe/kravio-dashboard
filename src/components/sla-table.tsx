import { useMemo, useState } from "react";
import type * as React from "react";
import { asset } from "@/lib/assets";
import {
  assigneeAvatars,
  cellClasses,
  cellTextClasses,
  initialTickets,
  priorityIcons,
  priorityRanks,
  slaLabel,
  sortableCols,
  statusIcons,
  tableGridCols,
  type SortKey,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";

type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

function compareTickets(a: Ticket, b: Ticket, key: SortKey): number {
  if (key === "priority") return priorityRanks[a.priority] - priorityRanks[b.priority];
  if (key === "slaHours") return a.slaHours - b.slaHours;
  return String(a[key]).localeCompare(String(b[key]), undefined, {
    numeric: true,
  });
}

function SortIcon({
  active,
  dir,
}: {
  active: boolean;
  dir?: "asc" | "desc";
}): React.ReactElement {
  return (
    <img
      alt=""
      className={cn(
        "block size-3 shrink-0 transition-[transform,opacity] duration-200",
        active ? "opacity-100" : "opacity-100 group-hover/th:opacity-70",
        active && dir === "desc" && "rotate-180",
      )}
      height={12}
      src={asset("sort")}
      width={12}
    />
  );
}

function toCsv(rows: Ticket[]): string {
  return [
    [
      "Ticket ID",
      "Subject",
      "Priority",
      "Assigned To",
      "Status",
      "Created Date",
      "SLA Due",
    ],
    ...rows.map((row) => [
      row.id,
      row.subject,
      row.priority,
      row.assignee,
      row.status,
      row.created,
      slaLabel(row.slaHours),
    ]),
  ]
    .map((cols) => cols.map((col) => `"${String(col).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function SlaTable(): React.ReactElement {
  const [rows, setRows] = useState<Ticket[]>(initialTickets);
  const [selected, setSelected] = useState<Set<string>>(new Set(["#2319"]));
  const [sort, setSort] = useState<SortState>(null);
  const [query, setQuery] = useState("");
  const [priorities, setPriorities] = useState<Set<TicketPriority>>(new Set());
  const [statuses, setStatuses] = useState<Set<TicketStatus>>(new Set());

  const filter = query.trim().toLowerCase();
  const visible = useMemo(() => {
    let list = rows.filter(
      (row) =>
        (!filter ||
          `${row.id} ${row.subject} ${row.assignee}`
            .toLowerCase()
            .includes(filter)) &&
        (!priorities.size || priorities.has(row.priority)) &&
        (!statuses.size || statuses.has(row.status)),
    );
    if (sort) {
      list = [...list].sort(
        (a, b) => compareTickets(a, b, sort.key) * (sort.dir === "asc" ? 1 : -1),
      );
    }
    return list;
  }, [rows, filter, priorities, statuses, sort]);

  const allSelected = visible.length > 0 && visible.every((row) => selected.has(row.id));
  const someSelected = visible.some((row) => selected.has(row.id));
  const filterCount = priorities.size + statuses.size;

  const cycleSort = (key: SortKey) =>
    setSort((prev) =>
      !prev || prev.key !== key
        ? { key, dir: "asc" }
        : prev.dir === "asc"
          ? { key, dir: "desc" }
          : null,
    );

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const row of visible) {
        if (allSelected) next.delete(row.id);
        else next.add(row.id);
      }
      return next;
    });

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

  const patchRow = (id: string, patch: Partial<Ticket>) =>
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );

  const exportCsv = () => {
    const rowsToExport = visible.filter(
      (row) => !selected.size || selected.has(row.id),
    );
    const url = URL.createObjectURL(
      new Blob([toCsv(rowsToExport)], { type: "text/csv" }),
    );
    Object.assign(document.createElement("a"), {
      href: url,
      download: "sla-monitoring.csv",
    }).click();
    URL.revokeObjectURL(url);
  };

  const ariaSort = (key: SortKey) =>
    sort?.key === key
      ? sort.dir === "asc"
        ? "ascending"
        : "descending"
      : "none";

  return (
    <Panel
      aria-labelledby="sla-title"
      className="w-full animate-rise [animation-delay:340ms]"
      patternStyle={{
        left: "calc(50% - 28.5px)",
        top: "calc(50% + 58.5px)",
        transform: "translate(-50%, -50%)",
      }}
    >
      <PanelHeader className="flex-wrap gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <Icon name="target" />
          <PanelTitle id="sla-title">SLA Monitoring</PanelTitle>
        </div>
        <div className="flex w-full items-start gap-2 sm:w-auto">
          <InputGroup className="h-8 min-w-0 flex-1 border-input shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)] sm:w-[240px] sm:flex-none">
            <Icon name="tb-search" />
            <InputGroupInput
              aria-label="Search tickets"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ticket"
              type="search"
              value={query}
            />
          </InputGroup>
          <Menu>
            <MenuTrigger
              render={
                <Button className="group/f h-8 gap-1.5 pr-2.5 pl-2" variant="surface" />
              }
            >
              <Icon
                className="transition-transform duration-200 group-hover/f:translate-y-px"
                name="filter"
              />
              Filter
              {filterCount > 0 && (
                <span className="-mr-1 ml-0.5 flex size-4 animate-pop items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground leading-none tabular">
                  {filterCount}
                </span>
              )}
            </MenuTrigger>
            <MenuPopup align="end" className="w-48">
              <MenuGroup>
                <MenuGroupLabel>Priority</MenuGroupLabel>
                {(["High", "Medium", "Low"] as const).map((p) => (
                  <MenuCheckboxItem
                    checked={priorities.has(p)}
                    key={p}
                    onCheckedChange={() => toggleSet(setPriorities, p)}
                  >
                    <Icon name={priorityIcons[p]} />
                    {p}
                  </MenuCheckboxItem>
                ))}
              </MenuGroup>
              <MenuSeparator />
              <MenuGroup>
                <MenuGroupLabel>Status</MenuGroupLabel>
                {(["In Review", "In Progress", "Delivered"] as const).map((s) => (
                  <MenuCheckboxItem
                    checked={statuses.has(s)}
                    key={s}
                    onCheckedChange={() => toggleSet(setStatuses, s)}
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
                      setPriorities(new Set());
                      setStatuses(new Set());
                    }}
                  >
                    Clear filters
                  </MenuItem>
                </>
              )}
            </MenuPopup>
          </Menu>
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label="Table actions"
                  size="icon"
                  variant="surface"
                >
                  <Icon name="more" />
                </Button>
              }
            />
            <MenuPopup align="end">
              <MenuGroup>
                <MenuItem onClick={exportCsv}>
                  Export {selected.size ? "selected" : "all"} as CSV
                </MenuItem>
                <MenuItem disabled={!sort} onClick={() => setSort(null)}>
                  Reset sorting
                </MenuItem>
                <MenuItem
                  disabled={!selected.size}
                  onClick={() => setSelected(new Set())}
                >
                  Clear selection
                </MenuItem>
              </MenuGroup>
            </MenuPopup>
          </Menu>
        </div>
      </PanelHeader>
      <div className="relative w-full overflow-x-auto rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)] [scrollbar-width:thin]">
        <div
          aria-label="SLA monitoring"
          aria-rowcount={visible.length + 1}
          className="min-w-[1138px]"
          role="table"
        >
          <div
            className={cn(
              tableGridCols,
              "h-9 rounded-lg border-[0.8px] border-black/[0.04] bg-secondary",
            )}
            role="row"
          >
            <div
              aria-sort={ariaSort("id")}
              className="flex h-full items-center gap-3 py-2.5 pr-4 pl-3"
              role="columnheader"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  aria-label="Select all tickets"
                  checked={allSelected}
                  indeterminate={
                    !allSelected && someSelected && selected.size > 1
                  }
                  onCheckedChange={toggleAll}
                />
                <button
                  className="group/th flex items-center gap-3 outline-none"
                  onClick={() => cycleSort("id")}
                  type="button"
                >
                  <span
                    className={cn(
                      "whitespace-nowrap text-[13px] leading-none transition-colors",
                      sort?.key === "id"
                        ? "text-foreground"
                        : "text-secondary-foreground",
                    )}
                  >
                    Ticket ID
                  </span>
                  <SortIcon active={sort?.key === "id"} dir={sort?.dir} />
                </button>
              </div>
            </div>
            {sortableCols.map((col, i) => (
              <div
                aria-sort={ariaSort(col.key)}
                className={cn(
                  "flex h-full items-center px-3 py-2.5",
                  i === sortableCols.length - 1 && "col-span-2",
                )}
                key={col.key}
                role="columnheader"
              >
                <button
                  className="group/th -mx-1 flex items-center gap-3 rounded px-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  onClick={() => cycleSort(col.key)}
                  type="button"
                >
                  <span
                    className={cn(
                      "whitespace-nowrap text-[13px] leading-none transition-colors group-hover/th:text-foreground",
                      sort?.key === col.key
                        ? "text-foreground"
                        : "text-secondary-foreground",
                    )}
                  >
                    {col.label}
                  </span>
                  <SortIcon active={sort?.key === col.key} dir={sort?.dir} />
                </button>
              </div>
            ))}
          </div>
          <div role="rowgroup">
            {visible.map((row, i) => {
              const isSelected = selected.has(row.id);
              return (
                <div
                  aria-selected={isSelected}
                  className={cn(
                    tableGridCols,
                    "group/row h-[45.75px] animate-rise border-black/[0.06] border-b bg-card transition-colors duration-150 hover:bg-[#fafafa]",
                  )}
                  key={row.id}
                  role="row"
                  style={{ animationDelay: `${420 + i * 60}ms` }}
                >
                  <div className={cn(cellClasses, "gap-2")} role="cell">
                    <Checkbox
                      aria-label={`Select ticket ${row.id}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(row.id)}
                    />
                    <span className="whitespace-nowrap font-medium text-[13px] text-cell-foreground leading-none">
                      {row.id}
                    </span>
                  </div>
                  <div className={cellClasses} role="cell">
                    <span
                      className={cn(
                        cellTextClasses,
                        "flex-1 transition-colors group-hover/row:text-foreground",
                      )}
                    >
                      {row.subject}
                    </span>
                  </div>
                  <div className={cn(cellClasses, "gap-2")} role="cell">
                    <Icon name={priorityIcons[row.priority]} />
                    <span className={cn(cellTextClasses, "flex-1")}>
                      {row.priority}
                    </span>
                  </div>
                  <div className={cn(cellClasses, "gap-2")} role="cell">
                    <Avatar className="transition-transform duration-200 group-hover/row:scale-110">
                      <AvatarImage
                        alt=""
                        height={20}
                        src={asset(assigneeAvatars[row.assignee])}
                        width={20}
                      />
                      <AvatarFallback>
                        {row.assignee
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn(cellTextClasses, "flex-1")}>
                      {row.assignee}
                    </span>
                  </div>
                  <div className={cn(cellClasses, "gap-2")} role="cell">
                    <span className="flex animate-pop" key={row.status}>
                      <Icon name={statusIcons[row.status]} />
                    </span>
                    <span className={cellTextClasses}>{row.status}</span>
                  </div>
                  <div className={cellClasses} role="cell">
                    <span className={cn(cellTextClasses, "flex-1")}>
                      {row.created}
                    </span>
                  </div>
                  <div className={cellClasses} role="cell">
                    <span className={cn(cellTextClasses, "flex-1")}>
                      {slaLabel(row.slaHours)}
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
                            aria-label={`Actions for ${row.id}`}
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
                          <MenuGroupLabel>{row.id}</MenuGroupLabel>
                          <MenuItem
                            disabled={row.status === "In Progress"}
                            onClick={() =>
                              patchRow(row.id, { status: "In Progress" })
                            }
                          >
                            <Icon name="status-progress" />
                            Mark in progress
                          </MenuItem>
                          <MenuItem
                            disabled={row.status === "In Review"}
                            onClick={() =>
                              patchRow(row.id, { status: "In Review" })
                            }
                          >
                            <Icon name="status-review" />
                            Send to review
                          </MenuItem>
                          <MenuItem
                            disabled={row.status === "Delivered"}
                            onClick={() =>
                              patchRow(row.id, { status: "Delivered" })
                            }
                          >
                            <Icon name="status-delivered" />
                            Mark delivered
                          </MenuItem>
                        </MenuGroup>
                        <MenuSeparator />
                        <MenuGroup>
                          <MenuGroupLabel>Reassign</MenuGroupLabel>
                          {(Object.keys(assigneeAvatars) as Ticket["assignee"][]).map(
                            (name) => (
                              <MenuItem
                                disabled={row.assignee === name}
                                key={name}
                                onClick={() => patchRow(row.id, { assignee: name })}
                              >
                                <img
                                  alt=""
                                  className="size-4 rounded-full"
                                  height={16}
                                  src={asset(assigneeAvatars[name])}
                                  width={16}
                                />
                                {name}
                              </MenuItem>
                            ),
                          )}
                        </MenuGroup>
                      </MenuPopup>
                    </Menu>
                  </div>
                </div>
              );
            })}
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
                  Adjust the search or filters.
                </p>
                <Button
                  className="mt-1"
                  onClick={() => {
                    setQuery("");
                    setPriorities(new Set());
                    setStatuses(new Set());
                  }}
                  size="sm"
                  variant="surface"
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
