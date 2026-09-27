import type * as React from "react";
import type { Availability, Priority, TicketStatus } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const statusVariants: Record<
  TicketStatus,
  "info" | "warning" | "success" | "error" | "secondary"
> = {
  "In Review": "info",
  "In Progress": "warning",
  Delivered: "success",
  Escalated: "error",
  Closed: "secondary",
};

export function TicketStatusBadge({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}): React.ReactElement {
  return (
    <Badge className={className} variant={statusVariants[status]}>
      {status}
    </Badge>
  );
}

const priorityVariants: Record<Priority, "error" | "warning" | "secondary"> = {
  High: "error",
  Medium: "warning",
  Low: "secondary",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}): React.ReactElement {
  return (
    <Badge className={className} variant={priorityVariants[priority]}>
      {priority}
    </Badge>
  );
}

export function AvailabilityDot({
  availability,
  className,
}: {
  availability: Availability;
  className?: string;
}): React.ReactElement {
  const color =
    availability === "online"
      ? "bg-success"
      : availability === "busy"
        ? "bg-warning"
        : "bg-muted-foreground/50";
  return (
    <span
      aria-label={availability}
      className={`inline-block size-1.5 rounded-full ${color} ${className ?? ""}`}
      role="img"
    />
  );
}

export function availabilityLabel(a: Availability): string {
  return a === "online" ? "Online" : a === "busy" ? "Busy" : "Offline";
}
