import { useMemo, useState } from "react";
import type * as React from "react";
import { useNav } from "@/lib/nav";
import { initials, useStore, type Client } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";
import { ConfirmDialog } from "@/components/confirm-dialog";

const clientGridCols =
  "grid grid-cols-[minmax(220px,1.4fr)_minmax(180px,1fr)_110px_120px_100px_40px]";
const cellClasses = "flex h-full min-w-0 items-center px-3 py-2.5";
const cellTextClasses =
  "truncate text-[13px] font-medium leading-none text-cell-foreground";

const plans = ["Enterprise", "Growth", "Starter"] as const;
const planVariant: Record<Client["plan"], "info" | "secondary" | "outline"> = {
  Enterprise: "info",
  Growth: "secondary",
  Starter: "outline",
};

function ClientDialog({
  open,
  onOpenChange,
  client,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}): React.ReactElement {
  const { addClient, patchClient } = useStore();
  const [company, setCompany] = useState(client?.company ?? "");
  const [contact, setContact] = useState(client?.contact ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [plan, setPlan] = useState<Client["plan"]>(client?.plan ?? "Starter");
  const [region, setRegion] = useState(client?.region ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const next: Record<string, string> = {};
    if (!company.trim()) next.company = "Company is required";
    if (!contact.trim()) next.contact = "Contact is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length) return;
    const payload = {
      company: company.trim(),
      contact: contact.trim(),
      email: email.trim(),
      plan,
      region: region.trim() || "—",
      joined: client?.joined ?? new Date().toISOString().slice(0, 10),
    };
    if (client) patchClient(client.id, payload);
    else addClient(payload);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup className="max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add Client"}</DialogTitle>
          <DialogDescription>
            {client
              ? `Update ${client.company}'s account details.`
              : "Create an account — tickets can then be linked to it."}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="cl-company"
              >
                Company
              </label>
              <Input
                aria-describedby={errors.company ? "cl-company-err" : undefined}
                aria-invalid={!!errors.company}
                autoFocus
                id="cl-company"
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (e.target.value.trim())
                    setErrors(({ company: _c, ...rest }) => rest);
                }}
                placeholder="Acme Corp"
                value={company}
              />
              {errors.company && (
                <p
                  className="text-destructive text-xs leading-none"
                  id="cl-company-err"
                  role="alert"
                >
                  {errors.company}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="cl-contact"
              >
                Contact
              </label>
              <Input
                aria-describedby={errors.contact ? "cl-contact-err" : undefined}
                aria-invalid={!!errors.contact}
                id="cl-contact"
                onChange={(e) => {
                  setContact(e.target.value);
                  if (e.target.value.trim())
                    setErrors(({ contact: _c, ...rest }) => rest);
                }}
                placeholder="Priya Nair"
                value={contact}
              />
              {errors.contact && (
                <p
                  className="text-destructive text-xs leading-none"
                  id="cl-contact-err"
                  role="alert"
                >
                  {errors.contact}
                </p>
              )}
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="cl-email"
              >
                Email
              </label>
              <Input
                aria-describedby={errors.email ? "cl-email-err" : undefined}
                aria-invalid={!!errors.email}
                id="cl-email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value))
                    setErrors(({ email: _e, ...rest }) => rest);
                }}
                placeholder="name@company.com"
                type="email"
                value={email}
              />
              {errors.email && (
                <p
                  className="text-destructive text-xs leading-none"
                  id="cl-email-err"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="cl-plan"
              >
                Plan
              </label>
              <Select
                onValueChange={(v) => setPlan(v as Client["plan"])}
                value={plan}
              >
                <SelectTrigger aria-label="Plan" id="cl-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {plans.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-[13px] text-secondary-foreground leading-none"
                htmlFor="cl-region"
              >
                Region
              </label>
              <Input
                id="cl-region"
                onChange={(e) => setRegion(e.target.value)}
                placeholder="APAC"
                value={region}
              />
            </div>
          </div>
        </DialogPanel>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={submit}>
            {client ? "Save Changes" : "Add Client"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

export function ClientsScreen(): React.ReactElement {
  const { clients, tickets, deleteClient } = useStore();
  const { navigate } = useNav();
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | undefined>();
  const [deleting, setDeleting] = useState<Client | undefined>();

  const filter = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      clients.filter(
        (c) =>
          !filter ||
          `${c.company} ${c.contact} ${c.email}`
            .toLowerCase()
            .includes(filter),
      ),
    [clients, filter],
  );

  const openCount = (id: string) =>
    tickets.filter(
      (t) => t.clientId === id && t.status !== "Delivered" && t.status !== "Closed",
    ).length;

  return (
    <>
      <ScreenHeader
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <Icon name="user-account" />
            Add Client
          </Button>
        }
        description="Accounts and the people behind them."
        title="Clients"
      />
      <Panel
        aria-label="Clients"
        className="w-full animate-rise [animation-delay:120ms]"
        patternStyle={{
          left: "calc(50% - 28.5px)",
          top: "calc(50% + 58.5px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PanelHeader className="flex-wrap gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-3">
            <Icon name="user-account" />
            <PanelTitle>All Clients</PanelTitle>
          </div>
          <InputGroup className="h-8 min-w-0 flex-1 border-input shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)] sm:w-[240px] sm:flex-none">
            <Icon name="tb-search" />
            <InputGroupInput
              aria-label="Search clients"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Company or contact"
              type="search"
              value={query}
            />
          </InputGroup>
        </PanelHeader>
        <div className="relative w-full overflow-x-auto rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)] [scrollbar-width:thin]">
          <div
            aria-label="Client list"
            aria-rowcount={visible.length + 1}
            className="min-w-[900px]"
            role="table"
          >
            <div
              className={cn(
                clientGridCols,
                "h-9 rounded-lg border-[0.8px] border-black/[0.04] bg-secondary",
              )}
              role="row"
            >
              {["Company", "Contact", "Plan", "Region", "Open Tickets"].map(
                (label) => (
                  <div
                    className="flex h-full items-center px-3 py-2.5"
                    key={label}
                    role="columnheader"
                  >
                    <span className="whitespace-nowrap text-[13px] text-secondary-foreground leading-none">
                      {label}
                    </span>
                  </div>
                ),
              )}
              <div role="columnheader" />
            </div>
            <div role="rowgroup">
              {visible.map((c, i) => (
                <div
                  className={cn(
                    clientGridCols,
                    "group/row h-[49px] animate-rise cursor-pointer border-black/[0.06] border-b bg-card transition-colors duration-150 hover:bg-[#fafafa]",
                  )}
                  key={c.id}
                  onClick={(e) => {
                    const el = e.target as HTMLElement;
                    if (el.closest("button, a, [role=combobox]")) return;
                    navigate({ name: "client-detail", clientId: c.id });
                  }}
                  role="row"
                  style={{ animationDelay: `${120 + i * 40}ms` }}
                >
                  <div className={cn(cellClasses, "gap-2.5")} role="cell">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">
                        {initials(c.company)}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      aria-label={`Open ${c.company}`}
                      className={cn(
                        cellTextClasses,
                        "rounded text-left underline-offset-2 outline-none transition-colors hover:underline group-hover/row:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
                      )}
                      onClick={() =>
                        navigate({ name: "client-detail", clientId: c.id })
                      }
                      type="button"
                    >
                      {c.company}
                    </button>
                  </div>
                  <div className={cn(cellClasses, "flex-col items-start justify-center gap-1")} role="cell">
                    <span className={cellTextClasses}>{c.contact}</span>
                    <span className="truncate text-[11px] text-muted-foreground leading-none">
                      {c.email}
                    </span>
                  </div>
                  <div className={cellClasses} role="cell">
                    <Badge variant={planVariant[c.plan]}>{c.plan}</Badge>
                  </div>
                  <div className={cellClasses} role="cell">
                    <span className={cellTextClasses}>{c.region}</span>
                  </div>
                  <div className={cellClasses} role="cell">
                    <span className={cn(cellTextClasses, "tabular-nums")}>
                      {openCount(c.id)}
                    </span>
                  </div>
                  <div
                    className="flex h-full items-center justify-center py-2.5"
                    role="cell"
                  >
                    <Menu>
                      <MenuTrigger
                        render={
                          <Button
                            aria-label={`Actions for ${c.company}`}
                            className="data-[popup-open]:bg-black/[0.05]"
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
                              navigate({ name: "client-detail", clientId: c.id })
                            }
                          >
                            Open client
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setEditing(c);
                              setDialogOpen(true);
                            }}
                          >
                            Edit details
                          </MenuItem>
                        </MenuGroup>
                        <MenuSeparator />
                        <MenuGroup>
                          <MenuItem
                            className="text-destructive data-highlighted:bg-destructive/8 data-highlighted:text-destructive"
                            onClick={() => setDeleting(c)}
                          >
                            Delete client
                          </MenuItem>
                        </MenuGroup>
                      </MenuPopup>
                    </Menu>
                  </div>
                </div>
              ))}
            </div>
            {visible.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <Icon className="opacity-50" name="user-account" />
                  </EmptyMedia>
                  <EmptyTitle>No clients match</EmptyTitle>
                  <EmptyDescription>
                    Adjust the search, or add a new client.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </Panel>
      <ClientDialog
        client={editing}
        key={editing?.id ?? "new"}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
      />
      <ConfirmDialog
        description={`${deleting?.company ?? ""} will be removed. Existing tickets keep their history but lose the client link.`}
        onConfirm={() => deleting && deleteClient(deleting.id)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        open={!!deleting}
        title="Delete this client?"
      />
    </>
  );
}
