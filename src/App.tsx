import type * as React from "react";
import { useEffect, useState } from "react";
import { NavProvider, useNav } from "@/lib/nav";
import { StoreProvider, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/command-palette";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { DashboardScreen } from "@/screens/dashboard";
import { TicketsScreen } from "@/screens/tickets";
import { TicketDetailScreen } from "@/screens/ticket-detail";
import { ClientsScreen } from "@/screens/clients";
import { ClientDetailScreen } from "@/screens/client-detail";
import { AgentsScreen } from "@/screens/agents";
import { KnowledgeBaseScreen } from "@/screens/knowledge-base";
import { ArticleEditorScreen } from "@/screens/article-editor";
import { IntegrationsScreen } from "@/screens/integrations";
import {
  CsatScreen,
  SlaComplianceScreen,
  WorkloadScreen,
} from "@/screens/analytics";
import { ReportsScreen } from "@/screens/reports";
import { FeedbackScreen } from "@/screens/feedback";
import { HelpScreen } from "@/screens/help";
import { SettingsScreen } from "@/screens/settings";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = () => setMatches(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function ViewContent(): React.ReactElement {
  const { view } = useNav();
  switch (view.name) {
    case "tickets":
      return <TicketsScreen tab={view.tab} />;
    case "ticket-detail":
      return <TicketDetailScreen ticketId={view.ticketId} />;
    case "clients":
      return <ClientsScreen />;
    case "client-detail":
      return <ClientDetailScreen clientId={view.clientId} />;
    case "agents":
      return <AgentsScreen tab={view.tab} />;
    case "knowledge-base":
      return <KnowledgeBaseScreen tab={view.tab} />;
    case "article-editor":
      return <ArticleEditorScreen articleId={view.articleId} />;
    case "integrations":
      return <IntegrationsScreen />;
    case "sla-compliance":
      return <SlaComplianceScreen />;
    case "csat":
      return <CsatScreen />;
    case "workload":
      return <WorkloadScreen />;
    case "reports":
      return <ReportsScreen />;
    case "feedback":
      return <FeedbackScreen />;
    case "help":
      return <HelpScreen />;
    case "settings":
      return <SettingsScreen />;
    default:
      return <DashboardScreen />;
  }
}

function Shell(): React.ReactElement {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { view } = useNav();
  const { settings } = useStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = () => {
    setPaletteOpen(true);
    setMobileOpen(false);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [view]);

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (settings.compactNav && isDesktop) setSidebarCollapsed(true);
  }, [settings.compactNav, isDesktop]);

  const sidebarHidden = !isDesktop || sidebarCollapsed;

  return (
    <div className="flex min-h-dvh w-full bg-background">
      <div
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 overflow-hidden transition-[width] duration-300 ease-[var(--ease-out-expo)] lg:block",
          sidebarCollapsed ? "w-0" : "w-[250px]",
        )}
        inert={sidebarCollapsed || undefined}
      >
        <Sidebar
          className={cn(
            "transition-opacity duration-200",
            sidebarCollapsed && "opacity-0",
          )}
          onCollapse={() => setSidebarCollapsed(true)}
          onOpenPalette={openPalette}
        />
      </div>
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          aria-label="Navigation"
          aria-modal="true"
          className={cn(
            "absolute inset-y-0 left-0 h-dvh bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] transition-transform duration-300 ease-[var(--ease-out-expo)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          inert={!mobileOpen || undefined}
          role="dialog"
        >
          <Sidebar
            onCollapse={() => setMobileOpen(false)}
            onOpenPalette={openPalette}
          />
        </div>
      </div>
      <main className="flex min-w-0 flex-1 flex-col bg-card px-3 shadow-[inset_0_0_0_0.8px_var(--border)] lg:min-h-dvh">
        <TopBar
          onMenu={() =>
            isDesktop ? setSidebarCollapsed(false) : setMobileOpen(true)
          }
          sidebarHidden={sidebarHidden}
        />
        <div className="flex w-full flex-col px-1 py-4" key={JSON.stringify(view)}>
          <div className="flex w-full flex-col gap-6">
            <ViewContent />
          </div>
        </div>
      </main>
      <CommandPalette onOpenChange={setPaletteOpen} open={paletteOpen} />
    </div>
  );
}

export default function App(): React.ReactElement {
  return (
    <StoreProvider>
      <NavProvider>
        <TooltipProvider delay={250}>
          <Shell />
        </TooltipProvider>
      </NavProvider>
    </StoreProvider>
  );
}
