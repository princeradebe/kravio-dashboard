import type * as React from "react";
import { useNav, viewMeta } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AbsIcon, Icon } from "@/components/icon";
import { NotificationsMenu } from "@/components/notifications-menu";

export function TopBar({
  onMenu,
  sidebarHidden,
}: {
  onMenu: () => void;
  sidebarHidden: boolean;
}): React.ReactElement {
  const { view, navigate, goHome } = useNav();
  const { unreadCount } = useStore();
  const meta = viewMeta[view.name];
  const isDashboard = view.name === "dashboard";

  return (
    <header className="flex h-[52px] w-full items-center justify-between px-3 py-3.5">
      <div className="flex items-center gap-4">
        <button
          aria-label="Open sidebar"
          className={cn(
            "-my-1 -ml-1 rounded-md p-1 outline-none transition-colors hover:bg-black/[0.05] focus-visible:ring-[3px] focus-visible:ring-ring/40",
            !sidebarHidden && "lg:hidden",
          )}
          onClick={onMenu}
          type="button"
        >
          <Icon className="rotate-180" name="sidebar-right" />
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-4">
          <a
            className="group/bc flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
          >
            <Icon name="hd-dashboard" />
            <span className="whitespace-nowrap text-muted-foreground text-sm leading-none transition-colors group-hover/bc:text-foreground">
              {meta.section}
            </span>
          </a>
          <span aria-hidden="true" className="relative h-2.5 w-1.5 shrink-0">
            <AbsIcon
              h={11}
              inset="-2.57% -7.15%"
              name="breadcrumb-slash"
              w={7}
            />
          </span>
          <span
            aria-current="page"
            className="whitespace-nowrap font-medium text-foreground text-sm leading-none"
          >
            {isDashboard ? "Dashboard" : meta.title}
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Tooltip>
          <NotificationsMenu>
            <TooltipTrigger
              render={
                <Button
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                  className="group/bell -m-1 size-6 data-[popup-open]:bg-black/[0.05]"
                  size="icon-sm"
                  variant="ghost"
                >
                  <span className="relative flex">
                    <Icon
                      className="origin-top transition-transform group-hover/bell:animate-[ring_600ms_ease-in-out]"
                      name="bell"
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex size-2 animate-pop rounded-full bg-destructive" />
                    )}
                  </span>
                </Button>
              }
            />
          </NotificationsMenu>
          <TooltipPopup>Notifications</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Settings"
                className="group/set -m-1 size-6"
                onClick={() => navigate({ name: "settings" })}
                size="icon-sm"
                variant="ghost"
              >
                <Icon
                  className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/set:rotate-90"
                  name="hd-settings"
                />
              </Button>
            }
          />
          <TooltipPopup>Settings</TooltipPopup>
        </Tooltip>
      </div>
    </header>
  );
}
