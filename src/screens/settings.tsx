import { useState } from "react";
import type * as React from "react";
import { useStore, type AppSettings } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/components/icon";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { ScreenHeader } from "@/components/screen-header";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = `set-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex min-w-0 flex-col gap-1">
        <label
          className="font-medium text-[13px] text-foreground leading-none"
          htmlFor={id}
        >
          {label}
        </label>
        <span className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </span>
      </div>
      <Switch checked={checked} id={id} onCheckedChange={onChange} />
    </div>
  );
}

export function SettingsScreen(): React.ReactElement {
  const { settings, patchSettings } = useStore();
  const [name, setName] = useState(settings.agentName);
  const [email, setEmail] = useState(settings.agentEmail);
  const [saved, setSaved] = useState(false);
  const [emailError, setEmailError] = useState("");

  const dirty =
    name !== settings.agentName || email !== settings.agentEmail;

  const saveProfile = () => {
    if (!name.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email");
      return;
    }
    setEmailError("");
    patchSettings({ agentName: name.trim(), agentEmail: email.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const notify = (key: keyof AppSettings) => (v: boolean) =>
    patchSettings({ [key]: v });

  return (
    <>
      <ScreenHeader
        description="Workspace, profile, and notification preferences."
        title="Settings"
      />
      <div className="flex w-full flex-col gap-4 min-[1200px]:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Panel className="animate-rise [animation-delay:120ms]">
            <PanelHeader>
              <div className="flex items-center gap-3">
                <Icon name="user-account" />
                <PanelTitle>Profile</PanelTitle>
              </div>
            </PanelHeader>
            <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-medium text-[13px] text-secondary-foreground leading-none"
                    htmlFor="pf-name"
                  >
                    Display name
                  </label>
                  <Input
                    id="pf-name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-medium text-[13px] text-secondary-foreground leading-none"
                    htmlFor="pf-email"
                  >
                    Email
                  </label>
                  <Input
                    aria-describedby={emailError ? "pf-email-err" : undefined}
                    aria-invalid={!!emailError}
                    id="pf-email"
                    onBlur={() => {
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                        setEmailError("Enter a valid email");
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value))
                        setEmailError("");
                    }}
                    type="email"
                    value={email}
                  />
                  {emailError && (
                    <p
                      className="text-destructive text-xs leading-none"
                      id="pf-email-err"
                      role="alert"
                    >
                      {emailError}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button disabled={!dirty} onClick={saveProfile} size="sm">
                  Save Profile
                </Button>
                {saved && (
                  <Badge className="animate-pop" variant="success">
                    Saved
                  </Badge>
                )}
              </div>
            </div>
          </Panel>

          <Panel className="animate-rise [animation-delay:160ms]">
            <PanelHeader>
              <div className="flex items-center gap-3">
                <Icon name="bell" />
                <PanelTitle>Notifications</PanelTitle>
              </div>
            </PanelHeader>
            <div className="flex flex-col divide-y divide-black/[0.05] rounded-xl bg-card px-4 py-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
              <ToggleRow
                checked={settings.notifyBreach}
                description="Alert when a ticket approaches its SLA deadline."
                label="SLA breach risk"
                onChange={notify("notifyBreach")}
              />
              <ToggleRow
                checked={settings.notifySlack}
                description="Post new tickets and escalations to the support channel."
                label="Slack notifications"
                onChange={notify("notifySlack")}
              />
              <ToggleRow
                checked={settings.notifyEmail}
                description="Email me when a ticket is assigned or a client replies."
                label="Email notifications"
                onChange={notify("notifyEmail")}
              />
              <ToggleRow
                checked={settings.weeklyDigest}
                description="A Monday-morning summary of volume, CSAT, and SLA health."
                label="Weekly digest"
                onChange={notify("weeklyDigest")}
              />
            </div>
          </Panel>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 min-[1200px]:w-[360px]">
          <Panel className="animate-rise [animation-delay:200ms]">
            <PanelHeader>
              <div className="flex items-center gap-3">
                <Icon name="hd-settings" />
                <PanelTitle>Appearance</PanelTitle>
              </div>
            </PanelHeader>
            <div className="flex flex-col divide-y divide-black/[0.05] rounded-xl bg-card px-4 py-1.5 shadow-[inset_0_0_0_0.8px_var(--input)]">
              <ToggleRow
                checked={settings.compactNav}
                description="Collapse the sidebar by default on desktop."
                label="Compact navigation"
                onChange={notify("compactNav")}
              />
            </div>
          </Panel>
          <Panel className="animate-rise [animation-delay:240ms]">
            <PanelHeader>
              <div className="flex items-center gap-3">
                <Icon name="feed-book" />
                <PanelTitle>Workspace</PanelTitle>
              </div>
            </PanelHeader>
            <div className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-[inset_0_0_0_0.8px_var(--input)]">
              {[
                { label: "Workspace", value: "Kravio Support" },
                { label: "Plan", value: "Scale" },
                { label: "Environment", value: "Local demo — dummy data" },
              ].map((row) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={row.label}
                >
                  <span className="font-medium text-muted-foreground text-xs leading-none">
                    {row.label}
                  </span>
                  <span className="truncate text-[13px] text-foreground leading-none">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
