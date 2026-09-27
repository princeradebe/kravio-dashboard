import { useState } from "react";
import type * as React from "react";
import { useNav } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";

function Stars({ rating }: { rating: number }): React.ReactElement {
  return (
    <span
      aria-label={`${rating} out of 5 stars`}
      className="flex items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          className={cn(i <= rating ? "opacity-100" : "opacity-20")}
          key={i}
          name="feed-star"
          size={12}
        />
      ))}
    </span>
  );
}

export function FeedbackScreen(): React.ReactElement {
  const { feedback, patchFeedback } = useStore();
  const { navigate } = useNav();
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const visible = feedback.filter(
    (f) =>
      filter === "all" ||
      (filter === "new" && f.status === "new") ||
      (filter === "replied" && f.status === "replied"),
  );

  const sendReply = (id: string) => {
    if (!reply.trim()) return;
    patchFeedback(id, { status: "replied" });
    setReplyFor(null);
    setReply("");
  };

  return (
    <>
      <ScreenHeader
        description="Ratings and comments from closed tickets."
        title="Feedback"
      />
      <Panel
        aria-label="Feedback inbox"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader>
          <div className="flex items-center gap-3">
            <Icon name="comment" />
            <PanelTitle>Inbox</PanelTitle>
          </div>
          <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
            {(["all", "new", "replied"] as const).map((f) => (
              <button
                aria-current={filter === f ? "true" : undefined}
                className={cn(
                  "h-7 whitespace-nowrap rounded-md px-2.5 text-xs leading-none capitalize outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40",
                  filter === f
                    ? "bg-card font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={f}
                onClick={() => setFilter(f)}
                type="button"
              >
                {f === "all" ? "All" : f === "new" ? "New" : "Replied"}
              </button>
            ))}
          </div>
        </PanelHeader>
        <div className="flex flex-col gap-1.5 rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
          {visible.map((f, i) => (
            <div
              className="flex animate-rise flex-col gap-2 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/50"
              key={f.id}
              style={{ animationDelay: `${140 + i * 30}ms` }}
            >
              <div className="flex items-center gap-2.5">
                <Stars rating={f.rating} />
                <span className="font-medium text-[13px] text-foreground leading-none">
                  {f.user}
                </span>
                <button
                  className="rounded text-muted-foreground text-xs leading-none underline-offset-2 outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  onClick={() =>
                    navigate({ name: "ticket-detail", ticketId: f.ticketId })
                  }
                  type="button"
                >
                  {f.ticketId}
                </button>
                <span className="text-muted-foreground text-xs leading-none">
                  {f.time}
                </span>
                <span className="flex-1" />
                <Badge variant={f.status === "new" ? "info" : "secondary"}>
                  {f.status === "new" ? "New" : "Replied"}
                </Badge>
              </div>
              <p className="text-[13px] text-secondary-foreground leading-relaxed">
                {f.comment}
              </p>
              {replyFor === f.id ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    aria-label={`Reply to ${f.user}`}
                    autoFocus
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Thank them or offer a fix…"
                    rows={2}
                    value={reply}
                  />
                  <div className="flex gap-2">
                    <Button
                      disabled={!reply.trim()}
                      onClick={() => sendReply(f.id)}
                      size="sm"
                    >
                      Send Reply
                    </Button>
                    <Button
                      onClick={() => {
                        setReplyFor(null);
                        setReply("");
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                f.status === "new" && (
                  <div>
                    <Button
                      onClick={() => setReplyFor(f.id)}
                      size="sm"
                      variant="surface"
                    >
                      Reply
                    </Button>
                  </div>
                )
              )}
            </div>
          ))}
          {visible.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Icon className="opacity-50" name="comment" />
                </EmptyMedia>
                <EmptyTitle>Nothing here</EmptyTitle>
                <EmptyDescription>
                  {filter === "new"
                    ? "Every response has a reply."
                    : "Feedback arrives when tickets are closed."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </Panel>
    </>
  );
}
