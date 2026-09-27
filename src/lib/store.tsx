"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { assigneeAvatars } from "@/lib/data";

export type Priority = "High" | "Medium" | "Low";
export type TicketStatus =
  | "In Review"
  | "In Progress"
  | "Delivered"
  | "Escalated"
  | "Closed";
export type Channel = "Email" | "Chat" | "Form" | "Phone";

export interface TicketMessage {
  id: string;
  author: string;
  role: "client" | "agent" | "system";
  time: string;
  body: string;
}

export interface Ticket {
  id: string;
  subject: string;
  priority: Priority;
  status: TicketStatus;
  assignee: string;
  clientId: string;
  channel: Channel;
  created: string;
  slaHours: number;
  escalated?: boolean;
  messages: TicketMessage[];
}

export interface Client {
  id: string;
  company: string;
  contact: string;
  email: string;
  plan: "Enterprise" | "Growth" | "Starter";
  joined: string;
  region: string;
}

export type Availability = "online" | "busy" | "offline";

export interface Agent {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  team: string;
  availability: Availability;
  email: string;
  resolvedWeek: number;
  csat: number;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  updated: string;
  views: number;
  status: "published" | "draft";
}

export interface Integration {
  id: string;
  name: string;
  blurb: string;
  category: "Communication" | "Productivity" | "Data" | "Auth";
  connected: boolean;
}

export interface AppNotification {
  id: string;
  icon: string;
  text: string;
  time: string;
  read: boolean;
}

export interface FeedbackItem {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  user: string;
  ticketId: string;
  time: string;
  status: "new" | "replied";
}

export interface ReportRecord {
  id: string;
  name: string;
  type: string;
  period: string;
  created: string;
  status: "Ready" | "Scheduled";
}

const msg = (
  id: string,
  author: string,
  role: TicketMessage["role"],
  time: string,
  body: string,
): TicketMessage => ({ id, author, role, time, body });

const seedTickets: Ticket[] = [
  {
    id: "#2319",
    subject: "Payment failed on invoice",
    priority: "High",
    status: "In Review",
    assignee: "John Doe",
    clientId: "alpha",
    channel: "Email",
    created: "2025-08-18",
    slaHours: 2,
    messages: [
      msg("m1", "Rina Kartika", "client", "09:41", "Our monthly invoice charge failed twice this morning — card on file ends 4471. Can someone look at it today?"),
      msg("m2", "John Doe", "agent", "10:05", "Looking at the payment gateway logs now. The 4471 card returned a 3DS timeout, not a decline — I'll retry the charge and confirm."),
      msg("m3", "Rina Kartika", "client", "10:52", "Thanks — please also re-send the invoice PDF, the last link expired."),
    ],
  },
  {
    id: "#2320",
    subject: "Login issue",
    priority: "Medium",
    status: "Delivered",
    assignee: "Sarah Lee",
    clientId: "nusantara",
    channel: "Chat",
    created: "2025-08-19",
    slaHours: 1,
    messages: [
      msg("m1", "Dedi Saputra", "client", "08:12", "Getting 'session expired' loops after SSO login."),
      msg("m2", "Sarah Lee", "agent", "08:30", "Found it — your SSO session TTL was set to 5 minutes after the last security update. Reset to 8 hours; please hard-refresh and retry."),
      msg("m3", "Dedi Saputra", "client", "08:47", "In now, thanks!"),
    ],
  },
  {
    id: "#2321",
    subject: "Feature request: export to Excel",
    priority: "Low",
    status: "In Progress",
    assignee: "John Doe",
    clientId: "globex",
    channel: "Form",
    created: "2025-08-19",
    slaHours: 24,
    messages: [
      msg("m1", "Lina Moreno", "client", "07:20", "We need the monthly usage report as .xlsx — CSV breaks our finance pipeline."),
      msg("m2", "John Doe", "agent", "11:04", "Filed as product request PROD-441. Meanwhile the CSV exports are UTF-8 BOM safe — Excel imports cleanly via Data → From Text/CSV."),
    ],
  },
  {
    id: "#2322",
    subject: "Agent reassignment request",
    priority: "Medium",
    status: "In Review",
    assignee: "Michael Wong",
    clientId: "alpha",
    channel: "Email",
    created: "2025-08-19",
    slaHours: 6,
    messages: [
      msg("m1", "Rina Kartika", "client", "13:15", "Our account manager changed regions — please route our tickets to the APAC team."),
      msg("m2", "Michael Wong", "agent", "14:02", "Done — I picked this one up from the EU queue. You'll see me on your tickets going forward."),
    ],
  },
  {
    id: "#2325",
    subject: "Webhook deliveries delayed",
    priority: "High",
    status: "Escalated",
    assignee: "Emma Chen",
    clientId: "kite",
    channel: "Email",
    created: "2025-08-17",
    slaHours: -2,
    escalated: true,
    messages: [
      msg("m1", "Tom Becker", "client", "22:10", "Order webhooks are arriving 15+ min late — our fulfilment service is timing out."),
      msg("m2", "Emma Chen", "agent", "22:31", "Confirmed elevated queue latency on the shared event bus. Escalated to platform engineering as INC-88."),
      msg("m3", "System", "system", "22:31", "Ticket escalated to Tier 2 — SLA clock paused pending engineering review."),
    ],
  },
  {
    id: "#2326",
    subject: "Billing address change rejected",
    priority: "Medium",
    status: "In Progress",
    assignee: "Sarah Lee",
    clientId: "acme",
    channel: "Form",
    created: "2025-08-18",
    slaHours: 9,
    messages: [
      msg("m1", "Priya Nair", "client", "15:44", "The billing portal rejects our new VAT address — says country code invalid."),
      msg("m2", "Sarah Lee", "agent", "16:20", "That's the portal validating against the old ISO list — workaround is to update the address under Company Details, not Billing. Fix is shipping Friday."),
    ],
  },
  {
    id: "#2327",
    subject: "Two-factor reset",
    priority: "High",
    status: "Delivered",
    assignee: "Michael Wong",
    clientId: "nusantara",
    channel: "Phone",
    created: "2025-08-19",
    slaHours: 3,
    messages: [
      msg("m1", "Dedi Saputra", "client", "09:02", "Admin lost phone with authenticator — need a 2FA reset before payroll export."),
      msg("m2", "Michael Wong", "agent", "09:20", "Verified over the phone and sent the recovery link — 2FA is re-enrolled on the new device."),
    ],
  },
  {
    id: "#2328",
    subject: "CSAT survey emails duplicated",
    priority: "Low",
    status: "Closed",
    assignee: "David Park",
    clientId: "acme",
    channel: "Email",
    created: "2025-08-16",
    slaHours: 48,
    messages: [
      msg("m1", "Priya Nair", "client", "11:30", "Customers received the satisfaction survey twice after ticket close."),
      msg("m2", "David Park", "agent", "13:45", "Deduped the survey rule — it was firing on both 'resolved' and 'closed' transitions. Closed."),
    ],
  },
  {
    id: "#2329",
    subject: "API rate limit too low",
    priority: "Medium",
    status: "Escalated",
    assignee: "Emma Chen",
    clientId: "kite",
    channel: "Email",
    created: "2025-08-18",
    slaHours: -5,
    escalated: true,
    messages: [
      msg("m1", "Tom Becker", "client", "10:14", "100 req/min is blocking our inventory sync — we need at least 300."),
      msg("m2", "Emma Chen", "agent", "10:40", "Rate-limit tiers are set per plan; I've asked the platform team to approve a custom tier for your workspace."),
    ],
  },
  {
    id: "#2330",
    subject: "Missing ticket attachments",
    priority: "Low",
    status: "In Review",
    assignee: "David Park",
    clientId: "globex",
    channel: "Chat",
    created: "2025-08-20",
    slaHours: 18,
    messages: [
      msg("m1", "Lina Moreno", "client", "16:55", "Screenshots attached via chat don't show in the ticket thread."),
      msg("m2", "David Park", "agent", "17:10", "Reproduced — attachments over 5 MB are dropped silently by the chat widget. Tracking the fix under BUG-210; for now attach files ≤5 MB."),
    ],
  },
];

const seedClients: Client[] = [
  { id: "alpha", company: "PT. Alpha Indonesia", contact: "Rina Kartika", email: "rina@alpha.id", plan: "Enterprise", joined: "2024-02-11", region: "APAC" },
  { id: "nusantara", company: "PT. Nusantara Retail", contact: "Dedi Saputra", email: "dedi@nusantara.co.id", plan: "Growth", joined: "2024-06-03", region: "APAC" },
  { id: "globex", company: "Globex Tech", contact: "Lina Moreno", email: "lina@globex.io", plan: "Growth", joined: "2024-09-27", region: "EMEA" },
  { id: "acme", company: "Acme Corp", contact: "Priya Nair", email: "priya@acme.com", plan: "Starter", joined: "2025-01-14", region: "EMEA" },
  { id: "kite", company: "Kite Analytics", contact: "Tom Becker", email: "tom@kite.dev", plan: "Enterprise", joined: "2024-04-30", region: "AMER" },
];

const seedAgents: Agent[] = [
  { id: "john", name: "John Doe", avatar: assigneeAvatars["John Doe"], role: "Senior Support Agent", team: "Tier 1", availability: "online", email: "john@kravio.io", resolvedWeek: 62, csat: 4.8 },
  { id: "sarah", name: "Sarah Lee", avatar: assigneeAvatars["Sarah Lee"], role: "Support Agent", team: "Tier 1", availability: "busy", email: "sarah@kravio.io", resolvedWeek: 55, csat: 4.9 },
  { id: "michael", name: "Michael Wong", avatar: assigneeAvatars["Michael Wong"], role: "Support Agent", team: "Tier 1", availability: "online", email: "michael@kravio.io", resolvedWeek: 48, csat: 4.7 },
  { id: "emma", name: "Emma Chen", avatar: null, role: "Escalation Engineer", team: "Tier 2", availability: "busy", email: "emma@kravio.io", resolvedWeek: 31, csat: 4.9 },
  { id: "david", name: "David Park", avatar: null, role: "Support Agent", team: "Tier 2", availability: "offline", email: "david@kravio.io", resolvedWeek: 37, csat: 4.6 },
];

const seedArticles: Article[] = [
  { id: "kb-1", title: "SSO Setup Guide", category: "Account", excerpt: "Connect your identity provider and roll out SSO for your whole workspace.", body: "SSO lets your team sign in with your identity provider.\n\n1. Open Settings → Security.\n2. Choose SAML or OIDC and paste the metadata URL.\n3. Test the connection, then enforce SSO for all members.\n\nTip: keep one owner account on password login during rollout.", updated: "2025-08-19", views: 1284, status: "published" },
  { id: "kb-2", title: "Login Troubleshooting", category: "Account", excerpt: "Fix session loops, expired links, and 2FA lockouts in minutes.", body: "Most login issues come down to sessions or 2FA.\n\n**Session expired loops** — clear cookies for the domain and check your device clock.\n**2FA lockout** — use a recovery code, or ask an admin to trigger a reset from Agents & Teams.", updated: "2025-08-18", views: 2140, status: "published" },
  { id: "kb-3", title: "Invoice Exports", category: "Billing", excerpt: "Export invoices as PDF or CSV and automate monthly delivery.", body: "Every invoice can be exported as PDF or CSV.\n\n- Single invoice: Billing → Invoices → Download.\n- Monthly batch: Billing → Exports → Schedule monthly.\n- CSV files are UTF-8 BOM safe for Excel import.", updated: "2025-08-17", views: 932, status: "published" },
  { id: "kb-4", title: "Webhook Retry Policy", category: "API", excerpt: "How delivery retries, exponential backoff, and dead-letter queues work.", body: "Failed webhook deliveries retry 5 times with exponential backoff (1s, 5s, 30s, 5m, 30m).\n\nAfter the final retry the event moves to the dead-letter queue, where it can be replayed for 7 days.\n\nWatch the Delivery Log for per-event status.", updated: "2025-08-15", views: 671, status: "published" },
  { id: "kb-5", title: "Managing SLAs", category: "Workflow", excerpt: "Set SLA targets per priority and get alerted before breaches.", body: "SLA targets map response and resolution times to priorities.\n\nConfigure them in Settings → SLA. Breach-risk alerts go to the agent and, after 30 minutes, to the team lead.", updated: "2025-08-12", views: 445, status: "draft" },
  { id: "kb-6", title: "CSAT Survey Customization", category: "Workflow", excerpt: "Change when surveys send, what they ask, and who receives them.", body: "CSAT surveys fire on ticket closure by default.\n\nEdit the trigger (resolved vs closed), rating scale (1-5 or thumbs), and template in Settings → Feedback.", updated: "2025-08-10", views: 388, status: "draft" },
];

const seedIntegrations: Integration[] = [
  { id: "slack", name: "Slack", blurb: "Post new tickets and breach alerts to a channel.", category: "Communication", connected: true },
  { id: "gmail", name: "Gmail", blurb: "Turn support emails into tickets automatically.", category: "Communication", connected: true },
  { id: "zendesk", name: "Zendesk Import", blurb: "One-time import of tickets and contacts.", category: "Data", connected: false },
  { id: "jira", name: "Jira", blurb: "Escalate tickets into linked engineering issues.", category: "Productivity", connected: true },
  { id: "intercom", name: "Intercom", blurb: "Sync conversations and user records.", category: "Communication", connected: false },
  { id: "okta", name: "Okta SSO", blurb: "SAML/OIDC single sign-on for your workspace.", category: "Auth", connected: false },
  { id: "webhooks", name: "Webhooks", blurb: "Send ticket events to any HTTPS endpoint.", category: "Data", connected: true },
  { id: "linear", name: "Linear", blurb: "Create Linear issues from escalated tickets.", category: "Productivity", connected: false },
];

const seedNotifications: AppNotification[] = [
  { id: "n1", icon: "feed-alert", text: "SLA breach risk on #2320 'Login issue'", time: "10:45 AM", read: false },
  { id: "n2", icon: "feed-ticket", text: "Ticket #2319 SLA updated", time: "11:20 AM", read: false },
  { id: "n3", icon: "feed-user", text: "PT. Nusantara Retail registered", time: "11:15 AM", read: false },
  { id: "n4", icon: "feed-repeat", text: "Ticket #2322 moved to Michael Wong", time: "11:00 AM", read: true },
  { id: "n5", icon: "feed-star", text: "'Great support response, thanks Sarah!'", time: "10:30 AM", read: true },
  { id: "n6", icon: "feed-book", text: "New article published: 'Login Troubleshooting'", time: "10:30 AM", read: true },
];

const seedFeedback: FeedbackItem[] = [
  { id: "f1", rating: 5, comment: "Great support response, thanks Sarah!", user: "Dedi Saputra", ticketId: "#2320", time: "10:30 AM", status: "new" },
  { id: "f2", rating: 4, comment: "Fast fix on the billing bug.", user: "Priya Nair", ticketId: "#2326", time: "Yesterday", status: "new" },
  { id: "f3", rating: 2, comment: "Webhook delays cost us an hour of fulfilment backlog.", user: "Tom Becker", ticketId: "#2325", time: "Yesterday", status: "replied" },
  { id: "f4", rating: 5, comment: "The 2FA reset was handled in minutes.", user: "Dedi Saputra", ticketId: "#2327", time: "Mon", status: "replied" },
  { id: "f5", rating: 3, comment: "Took two replies to find the right workaround.", user: "Lina Moreno", ticketId: "#2330", time: "Tue", status: "new" },
  { id: "f6", rating: 1, comment: "Survey emails went out twice to every customer.", user: "Priya Nair", ticketId: "#2328", time: "Aug 18", status: "replied" },
];

const seedReports: ReportRecord[] = [
  { id: "r1", name: "Weekly SLA Summary", type: "SLA", period: "Aug 11 – Aug 17", created: "2025-08-18", status: "Ready" },
  { id: "r2", name: "Agent Workload", type: "Agents", period: "Aug 4 – Aug 10", created: "2025-08-11", status: "Ready" },
  { id: "r3", name: "CSAT Digest", type: "CSAT", period: "Jul 2025", created: "2025-08-01", status: "Ready" },
  { id: "r4", name: "Monthly Ticket Volume", type: "Volume", period: "Sep 2025", created: "—", status: "Scheduled" },
];

export interface AppSettings {
  notifySlack: boolean;
  notifyEmail: boolean;
  notifyBreach: boolean;
  weeklyDigest: boolean;
  compactNav: boolean;
  agentName: string;
  agentEmail: string;
}

interface Store {
  tickets: Ticket[];
  clients: Client[];
  agents: Agent[];
  articles: Article[];
  integrations: Integration[];
  notifications: AppNotification[];
  feedback: FeedbackItem[];
  reports: ReportRecord[];
  settings: AppSettings;
  unreadCount: number;
  addTicket: (t: Omit<Ticket, "id" | "messages"> & { firstMessage?: string }) => Ticket;
  patchTicket: (id: string, patch: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  addTicketMessage: (id: string, message: Omit<TicketMessage, "id">) => void;
  addClient: (c: Omit<Client, "id">) => void;
  patchClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addAgent: (a: Omit<Agent, "id">) => void;
  patchAgent: (id: string, patch: Partial<Agent>) => void;
  addArticle: (a: Omit<Article, "id" | "updated" | "views">) => void;
  patchArticle: (id: string, patch: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  toggleIntegration: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  patchFeedback: (id: string, patch: Partial<FeedbackItem>) => void;
  addReport: (r: Omit<ReportRecord, "id" | "created" | "status">) => void;
  patchSettings: (patch: Partial<AppSettings>) => void;
}

const StoreContext = createContext<Store | null>(null);

const nextTicketId = (tickets: Ticket[]) =>
  `#${Math.max(...tickets.map((t) => Number(t.id.slice(1)))) + 1}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState(seedTickets);
  const [clients, setClients] = useState(seedClients);
  const [agents, setAgents] = useState(seedAgents);
  const [articles, setArticles] = useState(seedArticles);
  const [integrations, setIntegrations] = useState(seedIntegrations);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [feedback, setFeedback] = useState(seedFeedback);
  const [reports, setReports] = useState(seedReports);
  const [settings, setSettings] = useState<AppSettings>({
    notifySlack: true,
    notifyEmail: true,
    notifyBreach: true,
    weeklyDigest: false,
    compactNav: false,
    agentName: "Achmad Hakim",
    agentEmail: "achmadhakim@gmail.com",
  });

  const store = useMemo<Store>(
    () => ({
      tickets,
      clients,
      agents,
      articles,
      integrations,
      notifications,
      feedback,
      reports,
      settings,
      unreadCount: notifications.filter((n) => !n.read).length,
      addTicket: (t) => {
        const ticket: Ticket = {
          ...t,
          id: nextTicketId(tickets),
          messages: t.firstMessage
            ? [
                {
                  id: "m1",
                  author: t.clientId,
                  role: "client" as const,
                  time: "now",
                  body: t.firstMessage,
                },
              ]
            : [],
        };
        setTickets((prev) => [ticket, ...prev]);
        return ticket;
      },
      patchTicket: (id, patch) =>
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        ),
      deleteTicket: (id) =>
        setTickets((prev) => prev.filter((t) => t.id !== id)),
      addTicketMessage: (id, message) =>
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  messages: [
                    ...t.messages,
                    { ...message, id: `m${t.messages.length + 1}` },
                  ],
                }
              : t,
          ),
        ),
      addClient: (c) =>
        setClients((prev) => [...prev, { ...c, id: `c${prev.length + 1}` }]),
      patchClient: (id, patch) =>
        setClients((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        ),
      deleteClient: (id) =>
        setClients((prev) => prev.filter((c) => c.id !== id)),
      addAgent: (a) =>
        setAgents((prev) => [...prev, { ...a, id: `a${prev.length + 1}` }]),
      patchAgent: (id, patch) =>
        setAgents((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        ),
      addArticle: (a) =>
        setArticles((prev) => [
          { ...a, id: `kb-${Date.now()}`, updated: "2025-09-24", views: 0 },
          ...prev,
        ]),
      patchArticle: (id, patch) =>
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        ),
      deleteArticle: (id) =>
        setArticles((prev) => prev.filter((a) => a.id !== id)),
      toggleIntegration: (id) =>
        setIntegrations((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, connected: !i.connected } : i,
          ),
        ),
      markNotificationRead: (id) =>
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        ),
      markAllNotificationsRead: () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      patchFeedback: (id, patch) =>
        setFeedback((prev) =>
          prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        ),
      addReport: (r) =>
        setReports((prev) => [
          { ...r, id: `r${prev.length + 1}`, created: "2025-09-24", status: "Ready" },
          ...prev,
        ]),
      patchSettings: (patch) =>
        setSettings((prev) => ({ ...prev, ...patch })),
    }),
    [
      tickets,
      clients,
      agents,
      articles,
      integrations,
      notifications,
      feedback,
      reports,
      settings,
    ],
  );

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
