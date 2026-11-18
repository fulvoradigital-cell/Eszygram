"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Instagram,
  Loader2,
  MessageCircle,
  Play,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Tag,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/ToastProvider";
import { AutomationRuleModal } from "./AutomationRuleModal";
import { AutomationSimulator } from "./AutomationSimulator";
import type {
  AutomationLogDTO,
  AutomationRuleDTO,
  InstagramConnectionDTO,
  ProductDTO,
} from "@/types";

interface AutomationsManagerProps {
  initialRules: AutomationRuleDTO[];
  initialLogs: AutomationLogDTO[];
  initialConnection: InstagramConnectionDTO;
  products: ProductDTO[];
  creatorDisplayName: string;
  username: string;
  avatarUrl?: string;
}

export function AutomationsManager({
  initialRules,
  initialLogs,
  initialConnection,
  products,
  creatorDisplayName,
  username,
  avatarUrl,
}: AutomationsManagerProps) {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomationRuleDTO[]>(initialRules);
  const [logs, setLogs] = useState<AutomationLogDTO[]>(initialLogs);
  const [connection, setConnection] = useState<InstagramConnectionDTO>(initialConnection);
  const [isConnectingIg, setIsConnectingIg] = useState(false);
  const [isDisconnectingIg, setIsDisconnectingIg] = useState(false);
  const [activeTab, setActiveTab] = useState<"rules" | "simulator" | "logs">("rules");

  async function handleConnectInstagram(mode: "oauth" | "demo") {
    try {
      setIsConnectingIg(true);
      const res = await fetch("/api/creator/instagram/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          username,
          displayName: creatorDisplayName,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to connect Instagram.");
      }

      if (json.data.mode === "oauth" && json.data.authUrl) {
        window.location.href = json.data.authUrl;
        return;
      }

      if (json.data.connection) {
        setConnection(json.data.connection);
        toast.success(
          "Instagram Connected (Demo Mode)",
          `Connected @${json.data.connection.instagramUsername}. You can now pick Reels & Posts when creating rules.`
        );
      }
    } catch (err: unknown) {
      toast.error(
        "Connection Failed",
        err instanceof Error ? err.message : "Could not connect Instagram."
      );
    } finally {
      setIsConnectingIg(false);
    }
  }

  async function handleDisconnectInstagram() {
    if (!confirm("Disconnect your Instagram account? Live automated DMs will pause until reconnected.")) {
      return;
    }
    try {
      setIsDisconnectingIg(true);
      const res = await fetch("/api/creator/instagram/connection", {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to disconnect Instagram.");
      }
      setConnection(json.data);
      toast.success("Instagram Disconnected", "Your Instagram account has been unlinked.");
    } catch (err: unknown) {
      toast.error(
        "Error",
        err instanceof Error ? err.message : "Could not disconnect Instagram."
      );
    } finally {
      setIsDisconnectingIg(false);
    }
  }

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRuleDTO | null>(null);

  // Deletion State
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats
  const totalRules = rules.length;
  const activeRules = rules.filter((r) => r.isActive).length;
  const totalDmsSent = rules.reduce((acc, r) => acc + (r.totalDmsSent || 0), 0);

  // Save Rule (Create / Update)
  async function handleSaveRule(payload: Record<string, unknown>) {
    const isEdit = Boolean(editingRule);
    const url = isEdit
      ? `/api/creator/automations/${editingRule!.id}`
      : "/api/creator/automations";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to save rule.");
    }

    const savedRule = json.data as AutomationRuleDTO;

    if (isEdit) {
      setRules((prev) =>
        prev.map((r) => (r.id === savedRule.id ? savedRule : r))
      );
      toast.success("Rule Updated", `"${savedRule.name}" has been updated.`);
    } else {
      setRules((prev) => [savedRule, ...prev]);
      toast.success("Rule Created", `"${savedRule.name}" is now active!`);
    }
  }

  // Toggle Active Status
  async function handleToggleActive(ruleId: string, newActive: boolean) {
    // Optimistic update
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: newActive } : r))
    );

    try {
      const res = await fetch(`/api/creator/automations/${ruleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update status.");
      }

      toast.success(
        newActive ? "Rule Activated" : "Rule Paused",
        newActive
          ? "This automation will now listen for incoming comments."
          : "This automation has been temporarily paused."
      );
    } catch {
      // Revert on error
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, isActive: !newActive } : r))
      );
      toast.error("Error", "Could not update automation status.");
    }
  }

  // Delete Rule
  async function handleConfirmDelete() {
    if (!deletingRuleId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/creator/automations/${deletingRuleId}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete rule.");
      }

      setRules((prev) => prev.filter((r) => r.id !== deletingRuleId));
      toast.success("Rule Deleted", "The automation was removed.");
      setDeletingRuleId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting rule.";
      toast.error("Delete Failed", msg);
    } finally {
      setIsDeleting(false);
    }
  }

  // Refresh Logs
  async function handleRefreshLogs() {
    try {
      const res = await fetch("/api/creator/automations/logs");
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
        toast.success("Logs Refreshed", "Loaded latest execution history.");
      }
    } catch {
      toast.error("Error", "Failed to refresh activity logs.");
    }
  }

  const ruleToDelete = rules.find((r) => r.id === deletingRuleId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Instagram Automations
            </h1>
            <Badge variant="brand" size="sm" className="gap-1">
              <Bot className="w-3 h-3" />
              <span>Comment to DM</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Automatically reply to Reel comments and send instant direct messages with your product links.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => {
            setEditingRule(null);
            setIsModalOpen(true);
          }}
          className="gap-2 shadow-md shadow-brand-violet/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Automation</span>
        </Button>
      </div>

      {/* Instagram Account Connection Status Card */}
      <Card
        className={`p-4 sm:p-5 border transition-all ${
          connection.connected
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-amber-500/30 bg-amber-500/5"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                connection.connected
                  ? "bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white shadow-sm"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              }`}
            >
              <Instagram className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-navy font-display">
                  {connection.connected
                    ? `@${connection.instagramUsername}`
                    : "Instagram Account Not Connected"}
                </h2>
                {connection.connected ? (
                  <Badge
                    variant={connection.isDemoMode ? "warning" : "success"}
                    size="sm"
                    dot
                  >
                    {connection.isDemoMode ? "Demo Sandbox" : "Live Connected"}
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm" dot>
                    Simulator Only
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-muted leading-relaxed max-w-2xl">
                {connection.connected
                  ? connection.isDemoMode
                    ? "Connected in Demo Sandbox mode so you can select sample Reels/Posts and test automations. Add META_APP_ID & META_APP_SECRET in .env.local to link a real Instagram Business account."
                    : "Your Instagram Professional account is linked. Active rules will automatically reply to comments and send instant DMs."
                  : "Connect your Instagram Creator or Business account to trigger live DMs on real Reels & Posts. Without a connection, rules only run inside the Reels Simulator tab."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            {connection.connected ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDisconnectingIg}
                onClick={handleDisconnectInstagram}
                className="text-xs w-full sm:w-auto"
              >
                {isDisconnectingIg ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span>Disconnect</span>
              </Button>
            ) : (
              <>
                {connection.metaOAuthConfigured ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isConnectingIg}
                    onClick={() => handleConnectInstagram("oauth")}
                    className="text-xs shadow-brand w-full sm:w-auto"
                  >
                    {isConnectingIg ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Instagram className="w-3.5 h-3.5" />
                    )}
                    <span>Connect Instagram</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isConnectingIg}
                    onClick={() => handleConnectInstagram("demo")}
                    className="text-xs shadow-brand w-full sm:w-auto"
                  >
                    {isConnectingIg ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Instagram className="w-3.5 h-3.5" />
                    )}
                    <span>Connect Demo Instagram</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="p-4 border-slate-border bg-card">
          <p className="text-xs font-medium text-slate-muted">Total Automations</p>
          <p className="text-2xl font-extrabold text-navy font-display mt-0.5">
            {totalRules}
          </p>
          <p className="text-[11px] text-slate-muted mt-1">Configured rules</p>
        </Card>

        <Card className="p-4 border-slate-border bg-card">
          <p className="text-xs font-medium text-slate-muted">Active Rules</p>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display mt-0.5">
            {activeRules}
          </p>
          <p className="text-[11px] text-slate-muted mt-1">Listening to comments</p>
        </Card>

        <Card className="p-4 border-slate-border bg-card">
          <p className="text-xs font-medium text-slate-muted">Total DMs Dispatched</p>
          <p className="text-2xl font-extrabold text-brand-violet dark:text-brand-300 font-display mt-0.5">
            {totalDmsSent}
          </p>
          <p className="text-[11px] text-slate-muted mt-1">Direct messages sent</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-slate-border w-fit">
        {[
          { id: "rules", label: "Automation Rules", count: rules.length },
          { id: "simulator", label: "Reels Simulator" },
          { id: "logs", label: "Activity Logs", count: logs.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-brand-violet text-white shadow-sm"
                  : "text-slate-muted hover:text-slate-text hover:bg-slate-subtle/50"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-border/50 text-slate-muted dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: RULES LIST */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          {rules.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center border-slate-border">
              <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-navy font-display mb-1">
                No Automation Rules Yet
              </h2>
              <p className="text-xs text-slate-muted max-w-sm mx-auto mb-6">
                Create your first rule to automatically send direct messages and post public replies whenever an audience member comments on your Instagram posts.
              </p>
              <Button
                variant="gradient"
                size="md"
                onClick={() => {
                  setEditingRule(null);
                  setIsModalOpen(true);
                }}
                className="gap-2 shadow-md shadow-brand-violet/20"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Create First Automation</span>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {rules.map((rule) => (
                <Card
                  key={rule.id}
                  className={`p-5 border transition-all ${
                    rule.isActive
                      ? "border-slate-border bg-card"
                      : "border-slate-border/50 bg-slate-subtle/30 opacity-75"
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Left: Info & Keywords */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-300 border border-pink-500/20">
                          <Instagram className="w-3 h-3 shrink-0" />
                          Comment to DM
                        </span>

                        <Badge variant="outline" size="sm" className="text-[10px]">
                          {rule.targetPostId ? "Specific Post / Reel" : "All Posts & Reels"}
                        </Badge>

                        <span className="text-xs text-slate-muted">•</span>
                        <span className="text-xs text-slate-muted font-medium">
                          {rule.totalDmsSent || 0} DMs sent
                        </span>

                        {!rule.isActive && (
                          <Badge variant="outline" size="sm" className="text-[10px]">
                            Paused
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-navy truncate font-display">
                        {rule.name}
                      </h3>

                      {/* Keywords Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] text-slate-muted font-semibold">
                          Keywords:
                        </span>
                        {rule.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-violet/10 text-brand-violet"
                          >
                            &ldquo;{kw}&rdquo;
                          </span>
                        ))}
                      </div>

                      {/* DM Preview */}
                      <p className="text-xs text-slate-muted line-clamp-2 leading-relaxed bg-slate-subtle/50 p-2.5 rounded-xl border border-slate-border/60">
                        {rule.dmMessage}
                      </p>
                    </div>

                    {/* Right: Actions & Switch */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-muted">
                          {rule.isActive ? "Active" : "Paused"}
                        </span>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) =>
                            handleToggleActive(rule.id, checked)
                          }
                          aria-label="Toggle rule active status"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingRule(rule);
                            setIsModalOpen(true);
                          }}
                          className="h-8 px-2.5 text-xs font-semibold gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingRuleId(rule.id)}
                          className="h-8 w-8 p-0 text-slate-muted hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REELS SIMULATOR */}
      {activeTab === "simulator" && (
        <AutomationSimulator
          rules={rules}
          creatorDisplayName={creatorDisplayName}
          username={username}
          avatarUrl={avatarUrl}
        />
      )}

      {/* TAB 3: ACTIVITY LOGS */}
      {activeTab === "logs" && (
        <Card className="p-5 border-slate-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-display flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-violet" />
              <span>Execution History</span>
            </h3>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshLogs}
              className="h-8 px-2.5 gap-1.5 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </Button>
          </div>

          {logs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-muted">
              No executions logged yet. Use the Reels Simulator tab to test your automation.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-border text-slate-muted font-bold">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Rule</th>
                    <th className="py-2.5 px-3">Comment Text</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-subtle/50 transition-colors">
                      <td className="py-2.5 px-3 text-slate-muted whitespace-nowrap font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-navy">
                        @{log.instagramUsername}
                      </td>
                      <td className="py-2.5 px-3 text-slate-text">
                        {log.ruleName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-muted truncate max-w-[200px]">
                        &ldquo;{log.commentText}&rdquo;
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          DM Dispatched
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Rule Creation / Edit Modal */}
      {isModalOpen && (
        <AutomationRuleModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRule(null);
          }}
          onSave={handleSaveRule}
          initialRule={editingRule}
          products={products}
          username={username}
          instagramConnected={connection.connected}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deletingRuleId)}
        onClose={() => !isDeleting && setDeletingRuleId(null)}
        title="Delete Automation Rule?"
        size="sm"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="font-semibold text-navy dark:text-white">
                {ruleToDelete?.name}
              </strong>
              ? Incoming comments matching these keywords will no longer trigger automated DMs.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeletingRuleId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Rule</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
