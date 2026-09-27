export const periods = [
  { value: "last-week", label: "Last week", compare: "vs last week" },
  { value: "last-month", label: "Last month", compare: "vs last month" },
  { value: "last-quarter", label: "Last quarter", compare: "vs last quarter" },
] as const;

export type PeriodValue = (typeof periods)[number]["value"];

export interface KpiDatum {
  value: number;
  suffix?: string;
  delta: number;
}

export const kpiData: Record<
  PeriodValue,
  { tickets: KpiDatum; resolution: KpiDatum; sla: KpiDatum }
> = {
  "last-week": {
    tickets: { value: 3484, delta: 7.1 },
    resolution: { value: 486, delta: 2 },
    sla: { value: 92, suffix: "%", delta: -1.3 },
  },
  "last-month": {
    tickets: { value: 14921, delta: 4.6 },
    resolution: { value: 471, delta: -0.8 },
    sla: { value: 94, suffix: "%", delta: 1.9 },
  },
  "last-quarter": {
    tickets: { value: 43207, delta: 12.4 },
    resolution: { value: 455, delta: 3.2 },
    sla: { value: 91, suffix: "%", delta: -2.1 },
  },
};

export const kpiDefs = [
  {
    key: "tickets" as const,
    title: "Current Tickets",
    icon: "ticket",
    patternLeft: "calc(50% - 55.17px)",
  },
  {
    key: "resolution" as const,
    title: "Daily Avg. Resolution",
    icon: "zap",
    patternLeft: "calc(50% - 54.83px)",
    tracking: "tracking-[-0.14px]",
  },
  {
    key: "sla" as const,
    title: "SLA Compliance Rate",
    icon: "timer",
    patternLeft: "calc(50% - 55.5px)",
  },
];

export const sparkDefs: Record<
  (typeof kpiDefs)[number]["key"],
  { name: string; w: number; h: number; box: [number, number]; inset: string }
> = {
  tickets: {
    name: "spark-1",
    w: 92,
    h: 38,
    box: [91, 36.026],
    inset: "-3.11% -0.4% -0.47% -0.52%",
  },
  resolution: {
    name: "spark-2",
    w: 92,
    h: 33,
    box: [91, 32.158],
    inset: "-1.97% -0.4% 0 -0.13%",
  },
  sla: {
    name: "spark-3",
    w: 92,
    h: 37,
    box: [91, 35.842],
    inset: "-1.77% -0.38% 0 -0.43%",
  },
};

const BAR_X = [
  -22, 35, 91, 147, 203, 260, 317, 374, 431, 488, 545, 602, 659, 716, 773,
] as const;
export const barX = BAR_X;
export const barWidth = 40;
export const chartHeight = 216;
export const pctX = (v: number) => `${(v / 738) * 100}%`;
export const barCount = (height: number) => Math.round(height / (139 / 584));

const dayLabels = [
  "Sat",
  "Sun",
  "Mon",
  "Mon",
  "Tue",
  "Tue",
  "Wed",
  "Wed",
  "Thu",
  "Thu",
  "Fri",
  "Fri",
  "Sat",
  "Sat",
  "Sun",
] as const;

const toBars = (heights: number[]) =>
  heights.map((height, i) => ({ label: dayLabels[i], height }));

export const chartData: Record<
  PeriodValue,
  {
    total: number;
    delta: number;
    active: number;
    bars: { label: string; height: number }[];
  }
> = {
  "last-week": {
    total: 4790,
    delta: 8,
    active: 5,
    bars: toBars([
      68, 139, 161, 95, 128, 139, 110, 139, 182, 161, 149, 161, 84, 170, 125,
    ]),
  },
  "last-month": {
    total: 19640,
    delta: 5,
    active: 8,
    bars: toBars([
      92, 118, 150, 131, 104, 163, 142, 120, 176, 158, 133, 170, 112, 146, 101,
    ]),
  },
  "last-quarter": {
    total: 58312,
    delta: 11,
    active: 11,
    bars: toBars([
      80, 97, 124, 142, 118, 131, 156, 149, 168, 143, 177, 190, 139, 162, 121,
    ]),
  },
};

export const xAxisDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const yAxisTicks = [800, 600, 400, 200, 0];

export type FeedKind = "ticket" | "user" | "repeat" | "alert" | "book" | "star";

export type FeedPart = string | { strong: string };

export interface FeedItem {
  id: string;
  kind: FeedKind;
  title: string;
  time: string;
  body: FeedPart[];
  wrap?: boolean;
}

export const feedData: Record<"today" | "yesterday" | "week", FeedItem[]> = {
  today: [
    {
      id: "a1",
      kind: "ticket",
      title: "Ticket Updated",
      time: "11:20 AM",
      body: ["Ticket ", { strong: "#2319" }, " SLA updated"],
    },
    {
      id: "a2",
      kind: "user",
      title: "New Client Added",
      time: "11:15 AM",
      body: ["PT. Alpha Indonesia registered"],
    },
    {
      id: "a3",
      kind: "repeat",
      title: "Agent Reassigned",
      time: "11:00 AM",
      body: [
        "Ticket ",
        { strong: "#2322" },
        " moved to ",
        { strong: "Michael Wong" },
      ],
    },
    {
      id: "a4",
      kind: "alert",
      title: "SLA Breach Risk",
      time: "10:45 AM",
      body: ["Ticket ", { strong: "#2320" }, ' "', { strong: "Login issue" }, '"'],
    },
    {
      id: "a5",
      kind: "book",
      title: "Knowledge Base",
      time: "10:30 AM",
      body: ['New article published: "', { strong: "Login Troubleshooting" }, '"'],
      wrap: true,
    },
    {
      id: "a6",
      kind: "star",
      title: "Customer Feedback",
      time: "10:30 AM",
      body: ['"', { strong: "Great support response, thanks Sarah!" }, '"'],
      wrap: true,
    },
    {
      id: "a7",
      kind: "ticket",
      title: "Ticket Closed",
      time: "09:58 AM",
      body: [
        "Ticket ",
        { strong: "#2311" },
        " resolved by ",
        { strong: "Sarah Lee" },
      ],
    },
    {
      id: "a8",
      kind: "user",
      title: "Agent Online",
      time: "09:02 AM",
      body: [{ strong: "John Doe" }, " started a shift"],
    },
  ],
  yesterday: [
    {
      id: "b1",
      kind: "alert",
      title: "SLA Breached",
      time: "05:40 PM",
      body: ["Ticket ", { strong: "#2298" }, " missed first response"],
    },
    {
      id: "b2",
      kind: "repeat",
      title: "Agent Reassigned",
      time: "03:12 PM",
      body: [
        "Ticket ",
        { strong: "#2301" },
        " moved to ",
        { strong: "Sarah Lee" },
      ],
    },
    {
      id: "b3",
      kind: "star",
      title: "Customer Feedback",
      time: "01:26 PM",
      body: ['"', { strong: "Fast fix on the billing bug" }, '"'],
      wrap: true,
    },
    {
      id: "b4",
      kind: "ticket",
      title: "Ticket Updated",
      time: "11:05 AM",
      body: ["Ticket ", { strong: "#2305" }, " priority raised"],
    },
    {
      id: "b5",
      kind: "book",
      title: "Knowledge Base",
      time: "09:30 AM",
      body: ['Article updated: "', { strong: "Invoice Exports" }, '"'],
      wrap: true,
    },
  ],
  week: [
    {
      id: "c1",
      kind: "user",
      title: "New Client Added",
      time: "Mon",
      body: ["PT. Nusantara Retail registered"],
    },
    {
      id: "c2",
      kind: "alert",
      title: "SLA Breach Risk",
      time: "Mon",
      body: ["3 tickets near ", { strong: "response SLA" }],
    },
    {
      id: "c3",
      kind: "ticket",
      title: "Bulk Update",
      time: "Tue",
      body: [{ strong: "42" }, " tickets tagged ", { strong: "billing" }],
    },
    {
      id: "c4",
      kind: "repeat",
      title: "Queue Rebalanced",
      time: "Wed",
      body: ["Workload shifted to ", { strong: "Tier 2" }],
    },
    {
      id: "c5",
      kind: "book",
      title: "Knowledge Base",
      time: "Thu",
      body: ['New article published: "', { strong: "SSO Setup Guide" }, '"'],
      wrap: true,
    },
    {
      id: "c6",
      kind: "star",
      title: "CSAT Milestone",
      time: "Fri",
      body: ["CSAT reached ", { strong: "4.8 / 5" }],
    },
  ],
};

export const feedTabs = [
  { value: "today", label: "Today", caption: "new activities today" },
  { value: "yesterday", label: "Yesterday", caption: "activities yesterday" },
  { value: "week", label: "This week", caption: "highlights this week" },
] as const;

export const feedIcons: Record<FeedKind, string> = {
  ticket: "feed-ticket",
  user: "feed-user",
  repeat: "feed-repeat",
  alert: "feed-alert",
  book: "feed-book",
  star: "feed-star",
};

export const feedBodyText = (body: FeedPart[]) =>
  body.map((part) => (typeof part === "string" ? part : part.strong)).join("");

export const slaLabel = (hours: number) => {
  if (hours < 0) {
    const abs = Math.abs(hours);
    return abs >= 24 ? `${Math.round(abs / 24)}d overdue` : `${abs}h overdue`;
  }
  return hours >= 24 ? `${Math.round(hours / 24)}d left` : `${hours}h left`;
};

export const priorityIcons: Record<string, string> = {
  High: "signal-full",
  Medium: "signal-medium",
  Low: "signal-low",
};

export const statusIcons: Record<string, string> = {
  "In Review": "status-review",
  Delivered: "status-delivered",
  "In Progress": "status-progress",
  Escalated: "feed-alert",
  Closed: "check-tick",
};

export const assigneeAvatars: Record<string, string> = {
  "John Doe": "avatar-john",
  "Sarah Lee": "avatar-sarah",
  "Michael Wong": "avatar-michael",
};

export const priorityRanks: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export const ticketStatuses = [
  "In Review",
  "In Progress",
  "Delivered",
  "Escalated",
  "Closed",
] as const;

export const sortableCols = [
  { key: "subject", label: "Subject" },
  { key: "priority", label: "Priority" },
  { key: "assignee", label: "Assigned To" },
  { key: "status", label: "Status" },
  { key: "created", label: "Created Date" },
  { key: "slaHours", label: "SLA Due" },
] as const;

export type SortKey = "id" | (typeof sortableCols)[number]["key"];

export const tableGridCols =
  "grid grid-cols-[140px_minmax(170px,1fr)_160px_160px_160px_160px_140px_40px]";
export const cellClasses = "flex h-full min-w-0 items-center px-3 py-2.5";
export const cellTextClasses =
  "truncate text-[13px] font-medium leading-none text-cell-foreground";

export interface NavChild {
  id: string;
  label: string;
}

export interface NavItemDef {
  id: string;
  label: string;
  icon: string;
  children?: NavChild[];
}

export const navMain: NavItemDef[] = [
  { id: "overview", label: "Overview", icon: "sb-dashboard" },
  {
    id: "tickets",
    label: "Tickets",
    icon: "sb-ticket",
    children: [
      { id: "queue", label: "All / My Queue" },
      { id: "sla-risk", label: "SLA Breach Risk" },
      { id: "escalations", label: "Escalations" },
    ],
  },
  { id: "clients", label: "Clients", icon: "user-account" },
  {
    id: "agents",
    label: "Agents & Teams",
    icon: "user-group",
    children: [
      { id: "all-agents", label: "All Agents" },
      { id: "teams", label: "Teams" },
      { id: "schedules", label: "Shift Schedules" },
    ],
  },
  {
    id: "kb",
    label: "Knowledge Base",
    icon: "news",
    children: [
      { id: "articles", label: "Articles" },
      { id: "categories", label: "Categories" },
    ],
  },
  { id: "integrations", label: "Integrations", icon: "flow" },
];

export const navAnalytics: NavItemDef[] = [
  { id: "sla", label: "SLA Compliance", icon: "clock-01" },
  { id: "csat", label: "CSAT & NPS", icon: "sb-star" },
  { id: "workload", label: "Workload Analytics", icon: "analytics" },
  { id: "reports", label: "Reports", icon: "sb-file" },
];

export const navSupport: NavItemDef[] = [
  { id: "feedback", label: "Feedback", icon: "comment" },
  { id: "help", label: "Help & Support", icon: "headset" },
  { id: "settings", label: "Settings", icon: "sb-settings" },
];
