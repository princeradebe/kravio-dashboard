import type * as React from "react";
import { useNav, type ViewName } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const notificationView: Record<string, ViewName> = {
  "feed-ticket": "tickets",
  "feed-alert": "tickets",
  "feed-star": "feedback",
  "feed-user": "clients",
  "feed-book": "knowledge-base",
  "feed-repeat": "reports",
};

export function NotificationsMenu({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement {
  const { notifications, markNotificationRead, markAllNotificationsRead } =
    useStore();
  const { navigate } = useNav();

  return (
    <Menu>
      <MenuTrigger render={children} />
      <MenuPopup align="end" className="w-[320px]">
        <MenuGroup>
          <div className="flex items-center justify-between pr-2">
            <MenuGroupLabel>Notifications</MenuGroupLabel>
            <Button
              className="h-6 px-1.5 text-xs"
              onClick={markAllNotificationsRead}
              size="sm"
              variant="ghost"
            >
              Mark all read
            </Button>
          </div>
          {notifications.map((n) => (
            <MenuItem
              className={cn("items-start gap-2.5", !n.read && "font-medium")}
              closeOnClick
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                const view = notificationView[n.icon];
                if (view) navigate({ name: view });
              }}
            >
              <span className="relative mt-0.5 flex shrink-0">
                <Icon name={n.icon} size={14} />
                {!n.read && (
                  <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-info" />
                )}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5 whitespace-normal">
                <span className="text-[13px] leading-snug">{n.text}</span>
                <span className="font-normal text-muted-foreground text-xs">
                  {n.time}
                </span>
              </span>
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuItem onClick={() => navigate({ name: "settings" })}>
            <Icon name="sb-settings" />
            Notification settings
          </MenuItem>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
