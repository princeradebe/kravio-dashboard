import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AbsIcon, Icon } from "@/components/icon";

export function TopBar({
  onMenu,
  sidebarHidden,
}: {
  onMenu: () => void;
  sidebarHidden: boolean;
}): React.ReactElement {
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
          >
            <Icon name="hd-dashboard" />
            <span className="whitespace-nowrap text-muted-foreground text-sm leading-none transition-colors group-hover/bc:text-foreground">
              Overview
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
            Dashboard
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Notifications"
                className="group/bell -m-1 size-6"
                size="icon-sm"
                variant="ghost"
              >
                <Icon
                  className="origin-top transition-transform group-hover/bell:animate-[ring_600ms_ease-in-out]"
                  name="bell"
                />
              </Button>
            }
          />
          <TooltipPopup>Notifications</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Settings"
                className="group/set -m-1 size-6"
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
