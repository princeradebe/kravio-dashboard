import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ViewName =
  | "dashboard"
  | "tickets"
  | "ticket-detail"
  | "clients"
  | "client-detail"
  | "agents"
  | "knowledge-base"
  | "article-editor"
  | "integrations"
  | "sla-compliance"
  | "csat"
  | "workload"
  | "reports"
  | "feedback"
  | "help"
  | "settings";

export interface View {
  name: ViewName;
  tab?: string;
  ticketId?: string;
  clientId?: string;
  articleId?: string;
}

export const navViewMap: Record<string, View> = {
  overview: { name: "dashboard" },
  tickets: { name: "tickets" },
  queue: { name: "tickets", tab: "queue" },
  "sla-risk": { name: "tickets", tab: "sla-risk" },
  escalations: { name: "tickets", tab: "escalations" },
  clients: { name: "clients" },
  agents: { name: "agents" },
  "all-agents": { name: "agents", tab: "all-agents" },
  teams: { name: "agents", tab: "teams" },
  schedules: { name: "agents", tab: "schedules" },
  kb: { name: "knowledge-base" },
  articles: { name: "knowledge-base", tab: "articles" },
  categories: { name: "knowledge-base", tab: "categories" },
  integrations: { name: "integrations" },
  sla: { name: "sla-compliance" },
  csat: { name: "csat" },
  workload: { name: "workload" },
  reports: { name: "reports" },
  feedback: { name: "feedback" },
  help: { name: "help" },
  settings: { name: "settings" },
};

export const viewMeta: Record<
  ViewName,
  { section: string; title: string; description: string; navId: string; childId?: string }
> = {
  dashboard: { section: "Overview", title: "Dashboard", description: "", navId: "overview" },
  tickets: { section: "Tickets", title: "All Tickets", description: "Every conversation, in one queue.", navId: "tickets", childId: "queue" },
  "ticket-detail": { section: "Tickets", title: "Ticket", description: "", navId: "tickets" },
  clients: { section: "Clients", title: "Clients", description: "Accounts and the people behind them.", navId: "clients" },
  "client-detail": { section: "Clients", title: "Client", description: "", navId: "clients" },
  agents: { section: "Agents & Teams", title: "Agents & Teams", description: "Roster, coverage, and availability.", navId: "agents", childId: "all-agents" },
  "knowledge-base": { section: "Knowledge Base", title: "Knowledge Base", description: "Answers customers can find before they ask.", navId: "kb", childId: "articles" },
  "article-editor": { section: "Knowledge Base", title: "Article", description: "", navId: "kb" },
  integrations: { section: "Integrations", title: "Integrations", description: "Connect Kravio to the rest of your stack.", navId: "integrations" },
  "sla-compliance": { section: "Analytics & Insights", title: "SLA Compliance", description: "Response and resolution targets, at a glance.", navId: "sla" },
  csat: { section: "Analytics & Insights", title: "CSAT & NPS", description: "How customers feel about the support they get.", navId: "csat" },
  workload: { section: "Analytics & Insights", title: "Workload Analytics", description: "Where the queue weight sits across the team.", navId: "workload" },
  reports: { section: "Analytics & Insights", title: "Reports", description: "Generated exports and scheduled digests.", navId: "reports" },
  feedback: { section: "Support", title: "Feedback", description: "Ratings and comments from closed tickets.", navId: "feedback" },
  help: { section: "Support", title: "Help & Support", description: "Docs, shortcuts, and how to reach us.", navId: "help" },
  settings: { section: "Support", title: "Settings", description: "Workspace, profile, and notification preferences.", navId: "settings" },
};

interface NavState {
  view: View;
  navigate: (view: View) => void;
  goHome: () => void;
}

const NavContext = createContext<NavState | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>({ name: "dashboard" });
  const navigate = useCallback((next: View) => {
    setView(next);
    window.scrollTo({ top: 0 });
  }, []);
  const goHome = useCallback(() => navigate({ name: "dashboard" }), [navigate]);
  const value = useMemo(() => ({ view, navigate, goHome }), [view, navigate, goHome]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavState {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
