import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { navAnalytics, navMain, navSupport, type NavItemDef } from "@/lib/data";
import { navViewMap, useNav, viewMeta } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AbsIcon, Icon } from "@/components/icon";

function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="whitespace-nowrap text-muted-foreground text-xs uppercase leading-[1.6]">
      {children}
    </p>
  );
}

const activeClasses =
  "bg-card border-[0.8px] border-border shadow-[0px_4px_7px_0px_rgba(0,0,0,0.04)] text-foreground";
const inactiveClasses =
  "border-[0.8px] border-transparent hover:bg-white/70 hover:text-foreground";

function NavItem({
  item,
  active,
  onSelect,
  open,
  onToggle,
  activeChild,
  onSelectChild,
  muted,
}: {
  item: NavItemDef;
  active: boolean;
  onSelect: (id: string) => void;
  open?: boolean;
  onToggle?: () => void;
  activeChild?: string;
  onSelectChild?: (id: string) => void;
  muted?: boolean;
}): React.ReactElement {
  const hasChildren = !!item.children?.length;
  const isTickets = item.id === "tickets";
  return (
    <div className="flex w-full flex-col">
      <button
        aria-current={active ? "page" : undefined}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          "group/nav flex w-full items-center justify-between rounded-lg text-left text-[13px] leading-none outline-none transition-[background-color,box-shadow,border-color,color] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40",
          isTickets ? "h-9 px-2.5" : "h-8 px-2.5",
          active ? activeClasses : inactiveClasses,
          !active && (muted ? "text-muted-foreground" : "text-secondary-foreground"),
        )}
        onClick={() => (hasChildren ? onToggle?.() : onSelect(item.id))}
        type="button"
      >
        <span className={cn("flex items-center", isTickets ? "gap-2" : "gap-2.5")}>
          <span className="flex transition-transform duration-200 ease-out group-hover/nav:scale-110">
            <Icon name={item.icon} />
          </span>
          <span className="whitespace-nowrap">{item.label}</span>
        </span>
        {hasChildren && (
          <span
            className={cn(
              "flex transition-transform duration-300 ease-[var(--ease-out-expo)]",
              !open && "rotate-180",
            )}
          >
            <Icon name="arrow-up" size={12} />
          </span>
        )}
      </button>
      {hasChildren && (
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[var(--ease-out-expo)]",
            open ? "mt-0.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-0.5">
              {item.children?.map((child) => {
                const isActiveChild = activeChild === child.id;
                return (
                  <button
                    aria-current={isActiveChild ? "page" : undefined}
                    className="group/sub relative flex h-7 w-full items-center justify-end pl-2.5 outline-none"
                    key={child.id}
                    onClick={() => onSelectChild?.(child.id)}
                    tabIndex={open ? 0 : -1}
                    type="button"
                  >
                    <span
                      className={cn(
                        "flex h-full w-[188px] items-center rounded-md px-0 text-xs leading-none transition-[color,background-color,padding] duration-200 group-focus-visible/sub:ring-[3px] group-focus-visible/sub:ring-ring/40 group-hover/sub:bg-white/70 group-hover/sub:pl-1.5 group-hover/sub:text-foreground",
                        isActiveChild
                          ? "pl-1.5 font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {child.label}
                    </span>
                    <span className="pointer-events-none absolute top-[-5px] left-[18px] h-5 w-2">
                      <AbsIcon h={21} inset="-2% -5%" name="tree-line" w={9} />
                    </span>
                    <span className="pointer-events-none absolute top-[13px] left-[23px] size-1">
                      <img
                        alt=""
                        className={cn(
                          "absolute inset-0 block size-full transition-transform duration-200",
                          isActiveChild && "scale-150",
                        )}
                        height={4}
                        src={asset("tree-dot")}
                        width={4}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  onCollapse,
  onOpenPalette,
  className,
}: {
  onCollapse: () => void;
  onOpenPalette: () => void;
  className?: string;
}): React.ReactElement {
  const { view, navigate, goHome } = useNav();
  const meta = viewMeta[view.name];
  const activeNav = meta.navId;
  const activeChild = view.tab ?? meta.childId;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    tickets: true,
    agents: view.name === "agents",
    kb: view.name === "knowledge-base" || view.name === "article-editor",
  });
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        onOpenPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenPalette]);

  const selectItem = (id: string) => {
    navigate(navViewMap[id]);
  };
  const selectChild = (_parentId: string) => (childId: string) => {
    navigate(navViewMap[childId]);
  };
  const renderItems = (items: NavItemDef[], muted?: boolean) =>
    items.map((item) => (
      <NavItem
        active={activeNav === item.id && !activeChild && !item.children}
        activeChild={activeNav === item.id ? activeChild : undefined}
        item={item}
        key={item.id}
        muted={muted}
        onSelect={selectItem}
        onSelectChild={selectChild(item.id)}
        onToggle={() =>
          setOpenGroups((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
        }
        open={!!openGroups[item.id]}
      />
    ));

  return (
    <aside
      aria-label="Primary"
      className={cn("flex h-full w-[250px] shrink-0 flex-col", className)}
    >
      <div className="flex w-[250px] items-center justify-between overflow-clip px-3 py-3.5">
        <a
          className="flex w-[200px] items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <span className="relative size-6 shrink-0 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:rotate-[-8deg] hover:scale-105">
            <AbsIcon
              h={37}
              inset="-20.83% -20.83% -33.33% -20.83%"
              name="logo"
              w={34}
            />
          </span>
          <span className="flex-1 font-semibold text-foreground text-lg leading-none">
            Kravio
          </span>
        </a>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                aria-label="Collapse sidebar"
                className="-m-1 rounded-md p-1 outline-none transition-colors hover:bg-black/[0.05] focus-visible:ring-[3px] focus-visible:ring-ring/40"
                onClick={onCollapse}
                type="button"
              >
                <Icon name="sidebar-right" />
              </button>
            }
          />
          <TooltipPopup side="right">Collapse sidebar</TooltipPopup>
        </Tooltip>
      </div>
      <div className="flex min-h-0 w-[250px] flex-1 flex-col gap-4 px-3 pb-4">
        <div className="relative h-0 w-full shrink-0">
          <AbsIcon h={1} inset="-0.5px -0.22%" name="sb-divider" w={227} />
        </div>
        <InputGroup className="w-full shrink-0 border-border shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)]">
          <Icon name="search" />
          <InputGroupInput
            aria-label="Search anything"
            onFocus={(e) => {
              e.currentTarget.blur();
              onOpenPalette();
            }}
            placeholder="Search anything"
            readOnly
            ref={searchRef}
            type="search"
          />
          <InputGroupAddon
            aria-hidden="true"
            className="transition-opacity group-focus-within/input:opacity-0"
          >
            <span className="flex size-4 items-center justify-center rounded p-0.5">
              <Icon name="command" size={12} />
            </span>
            <span className="flex size-4 items-center justify-center rounded p-0.5 font-medium text-[#565d76] text-xs leading-none [font-variation-settings:'opsz'_14]">
              K
            </span>
          </InputGroupAddon>
        </InputGroup>
        <nav className="flex min-h-0 w-[226px] flex-1 flex-col items-center justify-between gap-5 overflow-x-hidden overflow-y-auto [scrollbar-width:none]">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-3">
              <NavLabel>Main Navigation</NavLabel>
              <div className="flex w-full flex-col gap-0.5">
                {renderItems(navMain)}
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              <NavLabel>Analytics &amp; Insights</NavLabel>
              <div className="flex w-full flex-col gap-0.5">
                {renderItems(navAnalytics)}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3">
            <NavLabel>Support</NavLabel>
            <div className="flex w-full flex-col">{renderItems(navSupport, true)}</div>
          </div>
        </nav>
        <button
          aria-current={view.name === "settings" ? "page" : undefined}
          className="group/acct flex w-[226px] shrink-0 items-center gap-2 rounded-xl border-[0.8px] border-border bg-card py-2 pr-2.5 pl-2 text-left outline-none drop-shadow-[0px_0px_4px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-200 hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.99]"
          onClick={() => navigate({ name: "settings" })}
          type="button"
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border-[0.8px] border-[#d9d9d9] bg-[#f7f7f7] p-2">
            <span className="whitespace-nowrap font-semibold text-secondary-foreground text-xs leading-none tracking-[-0.12px]">
              AH
            </span>
            <span className="absolute right-[-1.7px] bottom-[-1.7px] size-[9px]">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/40 [animation-duration:2.4s]" />
              <img
                alt=""
                className="absolute inset-0 block size-full"
                height={9}
                src={asset("online-dot")}
                width={9}
              />
            </span>
          </span>
          <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 whitespace-nowrap leading-none">
            <span className="font-medium text-foreground text-sm">
              Achmad Hakim
            </span>
            <span className="truncate text-subtle-foreground text-xs">
              achmadhakim@gmail.com
            </span>
          </span>
          <span className="flex transition-transform duration-200 group-hover/acct:scale-110">
            <Icon name="chevron-selector" size={18} />
          </span>
        </button>
      </div>
    </aside>
  );
}
