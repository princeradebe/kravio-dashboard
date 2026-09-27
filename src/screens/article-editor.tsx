import { useState } from "react";
import type * as React from "react";
import { useNav } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function ArticleEditorScreen({
  articleId,
}: {
  articleId?: string;
}): React.ReactElement {
  const { articles, addArticle, patchArticle, deleteArticle } = useStore();
  const { navigate } = useNav();
  const existing =
    articleId && articleId !== "new"
      ? articles.find((a) => a.id === articleId)
      : undefined;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState(existing?.category ?? "Account");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const categories = [...new Set(articles.map((a) => a.category))];

  const save = (publish: boolean) => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required";
    if (!excerpt.trim()) next.excerpt = "Excerpt is required";
    if (!body.trim()) next.body = "Body is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    const payload = {
      title: title.trim(),
      category,
      excerpt: excerpt.trim(),
      body: body.trim(),
      status: publish ? ("published" as const) : ("draft" as const),
    };
    if (existing) {
      patchArticle(existing.id, payload);
    } else {
      addArticle(payload);
    }
    navigate({ name: "knowledge-base" });
  };

  return (
    <>
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex animate-rise flex-col items-start gap-2">
          <button
            className="flex items-center gap-1.5 rounded-md text-muted-foreground text-xs leading-none outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
            onClick={() => navigate({ name: "knowledge-base" })}
            type="button"
          >
            <Icon className="rotate-90" name="arrow-up" size={10} />
            Knowledge Base
          </button>
          <h1 className="flex min-h-6 items-center gap-2.5 font-medium text-2xl text-foreground">
            {existing ? existing.title : "New Article"}
          </h1>
          {existing && (
            <div className="flex items-center gap-2">
              <Badge
                variant={existing.status === "published" ? "success" : "outline"}
              >
                {existing.status === "published" ? "Published" : "Draft"}
              </Badge>
              <span className="text-muted-foreground text-xs tabular-nums">
                {new Intl.NumberFormat("en-US").format(existing.views)} views ·
                updated {existing.updated}
              </span>
            </div>
          )}
        </div>
        <div className="flex animate-rise items-start gap-2 [animation-delay:60ms]">
          {existing && (
            <Button
              onClick={() => setConfirmDelete(true)}
              variant="outline"
            >
              Delete
            </Button>
          )}
          <Button onClick={() => save(false)} variant="outline">
            Save Draft
          </Button>
          <Button onClick={() => save(true)}>
            {existing?.status === "published" ? "Save Changes" : "Publish"}
          </Button>
        </div>
      </div>

      <Panel
        aria-label="Article editor"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader>
          <div className="flex items-center gap-3">
            <Icon name="news" />
            <PanelTitle>Editor</PanelTitle>
          </div>
        </PanelHeader>
        <div className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="ar-title"
              >
                Title
              </label>
              <Input
                aria-describedby={errors.title ? "ar-title-err" : undefined}
                aria-invalid={!!errors.title}
                autoFocus={!existing}
                id="ar-title"
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim())
                    setErrors(({ title: _t, ...rest }) => rest);
                }}
                placeholder="e.g. SSO Setup Guide"
                value={title}
              />
              {errors.title && (
                <p
                  className="text-destructive text-xs leading-none"
                  id="ar-title-err"
                  role="alert"
                >
                  {errors.title}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="ar-cat"
              >
                Category
              </label>
              <Select
                onValueChange={(v) => setCategory(v as string)}
                value={category}
              >
                <SelectTrigger aria-label="Category" id="ar-cat">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="font-medium text-[13px] text-secondary-foreground leading-none"
              htmlFor="ar-excerpt"
            >
              Excerpt
            </label>
            <Input
              aria-describedby={errors.excerpt ? "ar-excerpt-err" : undefined}
              aria-invalid={!!errors.excerpt}
              id="ar-excerpt"
              onChange={(e) => {
                setExcerpt(e.target.value);
                if (e.target.value.trim())
                  setErrors(({ excerpt: _e, ...rest }) => rest);
              }}
              placeholder="One-line summary shown in search results"
              value={excerpt}
            />
            {errors.excerpt && (
              <p
                className="text-destructive text-xs leading-none"
                id="ar-excerpt-err"
                role="alert"
              >
                {errors.excerpt}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="font-medium text-[13px] text-secondary-foreground leading-none"
              htmlFor="ar-body"
            >
              Body
            </label>
            <Textarea
              aria-describedby={errors.body ? "ar-body-err" : undefined}
              aria-invalid={!!errors.body}
              className="min-h-[260px] font-mono text-[13px] leading-relaxed"
              id="ar-body"
              onChange={(e) => {
                setBody(e.target.value);
                if (e.target.value.trim())
                  setErrors(({ body: _b, ...rest }) => rest);
              }}
              placeholder="Write the article — markdown supported"
              value={body}
            />
            {errors.body && (
              <p
                className="text-destructive text-xs leading-none"
                id="ar-body-err"
                role="alert"
              >
                {errors.body}
              </p>
            )}
          </div>
        </div>
      </Panel>
      {existing && (
        <ConfirmDialog
          description={`“${existing.title}” will be permanently removed from the knowledge base.`}
          onConfirm={() => {
            deleteArticle(existing.id);
            navigate({ name: "knowledge-base" });
          }}
          onOpenChange={setConfirmDelete}
          open={confirmDelete}
          title="Delete this article?"
        />
      )}
    </>
  );
}
