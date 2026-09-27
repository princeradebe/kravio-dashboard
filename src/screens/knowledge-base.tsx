import { useMemo, useState } from "react";
import type * as React from "react";
import { useNav } from "@/lib/nav";
import { useStore, type Article } from "@/lib/store";
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
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";
import { ConfirmDialog } from "@/components/confirm-dialog";

const kbTabs = [
  { id: "articles", label: "Articles" },
  { id: "categories", label: "Categories" },
] as const;

type KbTab = (typeof kbTabs)[number]["id"];

function ArticleCard({
  article,
  index,
}: {
  article: Article;
  index: number;
}): React.ReactElement {
  const { patchArticle, deleteArticle } = useStore();
  const { navigate } = useNav();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div
      className="group/card flex animate-rise flex-col gap-2.5 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_0_0_0.8px_var(--input)]"
      style={{ animationDelay: `${120 + index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          className="min-w-0 flex-1 truncate rounded text-left font-medium text-[13px] text-foreground leading-tight underline-offset-2 outline-none transition-colors hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40"
          onClick={() =>
            navigate({ name: "article-editor", articleId: article.id })
          }
          type="button"
        >
          {article.title}
        </button>
        <Menu>
          <MenuTrigger
            render={
              <Button
                aria-label={`Actions for ${article.title}`}
                className="-m-1 data-[popup-open]:bg-black/[0.05]"
                size="icon-sm"
                variant="ghost"
              >
                <Icon name="more" />
              </Button>
            }
          />
          <MenuPopup align="end">
            <MenuGroup>
              <MenuItem
                onClick={() =>
                  navigate({ name: "article-editor", articleId: article.id })
                }
              >
                Edit article
              </MenuItem>
              <MenuItem
                onClick={() =>
                  patchArticle(article.id, {
                    status:
                      article.status === "published" ? "draft" : "published",
                  })
                }
              >
                {article.status === "published"
                  ? "Unpublish"
                  : "Publish"}
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuItem
                className="text-destructive data-highlighted:bg-destructive/8 data-highlighted:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                Delete article
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </div>
      <p className="line-clamp-2 min-h-8 text-muted-foreground text-xs leading-relaxed">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary">{article.category}</Badge>
          <Badge
            variant={article.status === "published" ? "success" : "outline"}
          >
            {article.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
        <span className="text-muted-foreground text-xs leading-none tabular-nums">
          {new Intl.NumberFormat("en-US").format(article.views)} views
        </span>
      </div>
      <ConfirmDialog
        description={`“${article.title}” will be permanently removed from the knowledge base.`}
        onConfirm={() => deleteArticle(article.id)}
        onOpenChange={setConfirmDelete}
        open={confirmDelete}
        title="Delete this article?"
      />
    </div>
  );
}

export function KnowledgeBaseScreen({
  tab,
}: {
  tab?: string;
}): React.ReactElement {
  const { articles } = useStore();
  const { navigate } = useNav();
  const activeTab: KbTab =
    (kbTabs.find((t) => t.id === tab)?.id ?? "articles") as KbTab;
  const [query, setQuery] = useState("");

  const filter = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      articles.filter(
        (a) =>
          !filter ||
          `${a.title} ${a.category} ${a.excerpt}`.toLowerCase().includes(filter),
      ),
    [articles, filter],
  );

  const categories = useMemo(() => {
    const map = new Map<string, { count: number; views: number; published: number }>();
    for (const a of articles) {
      const entry = map.get(a.category) ?? { count: 0, views: 0, published: 0 };
      entry.count += 1;
      entry.views += a.views;
      if (a.status === "published") entry.published += 1;
      map.set(a.category, entry);
    }
    return [...map.entries()];
  }, [articles]);

  return (
    <>
      <ScreenHeader
        actions={
          <Button
            onClick={() =>
              navigate({ name: "article-editor", articleId: "new" })
            }
          >
            <Icon name="news" />
            New Article
          </Button>
        }
        description="Answers customers can find before they ask."
        title="Knowledge Base"
      />
      <Panel
        aria-label="Knowledge base"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader className="flex-wrap gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-3">
            <Icon name="news" />
            <PanelTitle>
              {kbTabs.find((t) => t.id === activeTab)?.label}
            </PanelTitle>
          </div>
          <div className="flex w-full items-start gap-2 sm:w-auto">
            <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
              {kbTabs.map((t) => (
                <button
                  aria-current={activeTab === t.id ? "true" : undefined}
                  className={cn(
                    "h-7 whitespace-nowrap rounded-md px-2.5 text-xs leading-none outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    activeTab === t.id
                      ? "bg-card font-medium text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  key={t.id}
                  onClick={() => navigate({ name: "knowledge-base", tab: t.id })}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
            {activeTab === "articles" && (
              <InputGroup className="h-8 min-w-0 flex-1 border-input shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)] sm:w-[220px] sm:flex-none">
                <Icon name="tb-search" />
                <InputGroupInput
                  aria-label="Search articles"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Article"
                  type="search"
                  value={query}
                />
              </InputGroup>
            )}
          </div>
        </PanelHeader>
        <div className="rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
          {activeTab === "articles" &&
            (visible.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <Icon className="opacity-50" name="news" />
                  </EmptyMedia>
                  <EmptyTitle>No articles match</EmptyTitle>
                  <EmptyDescription>
                    Adjust the search, or write a new article.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 p-1.5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((a, i) => (
                  <ArticleCard article={a} index={i} key={a.id} />
                ))}
              </div>
            ))}
          {activeTab === "categories" && (
            <div className="flex flex-col p-1.5">
              {categories.map(([name, stats], i) => (
                <div
                  className="flex animate-rise items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/60"
                  key={name}
                  style={{ animationDelay: `${120 + i * 30}ms` }}
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                    <Icon name="news" size={14} />
                  </span>
                  <span className="min-w-0 flex-1 font-medium text-[13px] text-foreground leading-none">
                    {name}
                  </span>
                  <span className="text-muted-foreground text-xs leading-none tabular-nums">
                    {stats.published}/{stats.count} published
                  </span>
                  <span className="w-20 text-right text-muted-foreground text-xs leading-none tabular-nums">
                    {new Intl.NumberFormat("en-US").format(stats.views)} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>
    </>
  );
}
