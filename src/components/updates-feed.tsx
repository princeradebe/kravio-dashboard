import type * as React from "react";
import { useState } from "react";
import {
  feedBodyText,
  feedData,
  feedIcons,
  feedTabs,
  type FeedItem,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { AnimatedNumber } from "@/components/animated-number";
import { AbsIcon, Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";

function Highlight({
  value,
  query,
}: {
  value: string;
  query: string;
}): React.ReactElement {
  if (!query) return <>{value}</>;
  const index = value.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return <>{value}</>;
  return (
    <>
      {value.slice(0, index)}
      <mark className="rounded-[2px] bg-[#fef3c7] text-inherit">
        {value.slice(index, index + query.length)}
      </mark>
      {value.slice(index + query.length)}
    </>
  );
}

function FeedEntry({
  item,
  last,
  index,
  query,
}: {
  item: FeedItem;
  last: boolean;
  index: number;
  query: string;
}): React.ReactElement {
  return (
    <li
      className="group/item relative flex w-full animate-rise items-start gap-3"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <span className="relative z-10 flex items-center rounded-lg border-[0.8px] border-input bg-card p-2 transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-expo)] group-hover/item:-translate-y-px group-hover/item:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <Icon
          className="transition-transform duration-300 group-hover/item:scale-110"
          name={feedIcons[item.kind]}
        />
      </span>
      {!last && (
        <span
          aria-hidden="true"
          className="dash-y absolute top-8 bottom-[-20px] left-[15.5px] w-px"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 pt-0.5 text-xs tracking-[-0.12px]">
        <div className="flex w-full items-center justify-between gap-2 leading-none">
          <p className="truncate font-medium text-foreground transition-colors">
            <Highlight query={query} value={item.title} />
          </p>
          <time className="shrink-0 whitespace-nowrap text-subtle-foreground">
            {item.time}
          </time>
        </div>
        <p
          className={cn(
            "text-subtle-foreground",
            item.wrap ? "leading-[1.4]" : "truncate leading-none",
          )}
        >
          {item.body.map((part, i) =>
            typeof part === "string" ? (
              <Highlight key={i} query={query} value={part} />
            ) : (
              <span className="text-foreground" key={i}>
                <Highlight query={query} value={part.strong} />
              </span>
            ),
          )}
        </p>
      </div>
    </li>
  );
}

export function UpdatesFeed({
  className,
}: {
  className?: string;
}): React.ReactElement {
  const [tab, setTab] = useState<"today" | "yesterday" | "week">("today");
  const [query, setQuery] = useState("");
  const tabIndex = feedTabs.findIndex((entry) => entry.value === tab);
  const trimmed = query.trim();
  const items = feedData[tab].filter(
    (item) =>
      !trimmed ||
      `${item.title} ${feedBodyText(item.body)}`
        .toLowerCase()
        .includes(trimmed.toLowerCase()),
  );
  const caption = feedTabs[tabIndex].caption;

  return (
    <Panel
      aria-labelledby="updates-title"
      className={cn("h-[560px] animate-rise [animation-delay:200ms]", className)}
      patternStyle={{
        left: "calc(50% - 55.5px)",
        top: -0.8,
        transform: "translateX(-50%)",
      }}
    >
      <PanelHeader>
        <PanelTitle id="updates-title">Latest Updates</PanelTitle>
        <Icon name="news" />
      </PanelHeader>
      <div className="relative flex min-h-px w-full flex-1 flex-col items-start gap-4 overflow-clip rounded-xl border-[0.8px] border-input bg-card px-3.5 pt-4 pb-3.5">
        <div className="flex w-full flex-col gap-3">
          <ToggleGroup
            aria-label="Activity range"
            className="w-full"
            onValueChange={(next) => {
              const value = next[next.length - 1];
              if (value) setTab(value as typeof tab);
            }}
            value={[tab]}
          >
            <span
              aria-hidden="true"
              className="absolute top-0 h-7 rounded-lg border border-primary bg-[linear-gradient(180deg,#37475d_0%,#1f2937_64.697%)] transition-[left] duration-300 ease-[var(--ease-out-expo)]"
              style={{
                width: "calc((100% - 16px) / 3)",
                left: `calc(((100% - 16px) / 3 + 8px) * ${tabIndex})`,
              }}
            />
            {feedTabs.map((entry) => (
              <ToggleGroupItem key={entry.value} value={entry.value}>
                {entry.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <InputGroup className="w-full border-border">
            <Icon name="search-2" />
            <InputGroupInput
              aria-label="Search activities"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search activities"
              type="search"
              value={query}
            />
            {query && (
              <button
                aria-label="Clear search"
                className="animate-fade text-subtle-foreground text-xs leading-none hover:text-foreground"
                onClick={() => setQuery("")}
                type="button"
              >
                Clear
              </button>
            )}
          </InputGroup>
        </div>
        <div className="flex w-full flex-col gap-4">
          <p className="whitespace-nowrap text-[13px] text-muted-foreground leading-none tracking-[-0.16px]">
            <span className="font-medium text-base text-foreground">
              <AnimatedNumber
                delay={tab === "today" ? 300 : 0}
                duration={700}
                key={tab}
                value={items.length}
              />
            </span>
            <span className="text-base"> </span>
            {trimmed
              ? `${items.length === 1 ? "match" : "matches"} for “${trimmed}”`
              : caption}
          </p>
          <div className="relative h-0 w-full">
            <AbsIcon h={1} inset="-0.5px 0" name="feed-divider" w={296} />
          </div>
        </div>
        <ol
          className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          key={tab}
        >
          {items.map((item, i) => (
            <FeedEntry
              index={i}
              item={item}
              key={item.id}
              last={i === items.length - 1}
              query={trimmed}
            />
          ))}
          {items.length === 0 && (
            <li className="flex w-full animate-fade flex-col items-center gap-1.5 py-10 text-center">
              <Icon className="opacity-50" name="search-2" />
              <p className="font-medium text-[13px] text-foreground">
                No activity found
              </p>
              <p className="text-muted-foreground text-xs">
                Try a ticket number, agent or client name.
              </p>
            </li>
          )}
        </ol>
      </div>
    </Panel>
  );
}
