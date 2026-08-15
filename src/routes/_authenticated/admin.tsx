import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  apiGetAdminStats, 
  apiGetAdminHistory, 
  apiDeleteAdminAnalysis,
  apiGetAdminUsers,
  apiGetAdminUserHistory
} from "@/lib/api";
import { useSession } from "@/lib/session";
import { useState } from "react";
import {
  Users as UsersIcon,
  Activity,
  Key,
  Database,
  ShieldAlert,
  Server,
  HardDrive,
  Cpu,
  ArrowLeft,
  Trash2,
  Clock
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    // Check if user is admin can be done here if context has it,
    // but the API query will catch 403 anyway.
  },
  head: () => ({
    meta: [
      { title: "Server Room — Admin Dashboard" },
      { name: "description", content: "Lumina Admin Dashboard." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: apiDeleteAdminAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "history"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      if (selectedUserId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "userHistory", selectedUserId] });
      }
    },
  });

  const { data: stats, isLoading: isStatsLoading, error: statsError } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: apiGetAdminStats,
    retry: false,
  });

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["admin", "history"],
    queryFn: () => apiGetAdminHistory(1, 50),
    retry: false,
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiGetAdminUsers(1, 100),
    retry: false,
  });

  const { data: userHistory, isLoading: isUserHistoryLoading } = useQuery({
    queryKey: ["admin", "userHistory", selectedUserId],
    queryFn: () => apiGetAdminUserHistory(selectedUserId!, 1, 50),
    enabled: !!selectedUserId,
  });

  if (statsError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="mb-4 h-16 w-16 text-danger" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You do not have clearance for the Server Room.</p>
        <Link
          to="/dashboard"
          className="mt-6 flex items-center gap-2 rounded-lg bg-card px-4 py-2 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  // Render a table of analysis rows
  const renderAnalysisRows = (analyses: any[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={8} className="py-8 text-center text-muted-foreground">
            Loading stream...
          </td>
        </tr>
      );
    }
    if (!analyses || analyses.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="py-8 text-center text-muted-foreground">
            No analyses found.
          </td>
        </tr>
      );
    }
    return analyses.map((item) => (
      <tr key={item._id} className="transition-colors hover:bg-muted/50">
        <td className="py-4 pr-4 whitespace-nowrap text-muted-foreground text-xs">
          {new Date(item.createdAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="py-4 pr-4">
          <div className="font-medium">{item.userId?.name || "Guest"}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[120px]">
            {item.userId?.email || "IP"}
          </div>
        </td>
        <td className="py-4 pr-4">
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium border border-border">
            {item.platform}
          </span>
        </td>
        <td className="py-4 pr-4 max-w-[200px]">
          <Dialog>
            <DialogTrigger asChild>
              <button className="truncate w-full text-left text-muted-foreground hover:text-foreground hover:underline decoration-muted-foreground/30 underline-offset-4 transition-colors focus:outline-none">
                {item.inputText}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Full Analysis Snippet</DialogTitle>
              </DialogHeader>
              <div className="mt-4 p-4 rounded-md bg-muted/50 border border-border text-sm whitespace-pre-wrap text-foreground max-h-[60vh] overflow-y-auto">
                {item.inputText}
              </div>
            </DialogContent>
          </Dialog>
        </td>
        <td className="py-4 pr-4">
          <span
            className={`font-bold ${item.overallRisk > 65 ? "text-danger" : item.overallRisk > 35 ? "text-warning" : "text-success"}`}
          >
            {item.overallRisk}/100
          </span>
        </td>
        <td className="py-4 pr-4 text-right font-mono text-xs">
          {item.tokensUsed > 0 ? item.tokensUsed.toLocaleString() : "-"}
        </td>
        <td className="py-4 text-right font-mono text-xs text-muted-foreground">
          {item.providerKey !== "unknown" ? item.providerKey : "-"}
        </td>
        <td className="py-4 pr-4 text-right">
          <button
            onClick={() => deleteMutation.mutate(item._id)}
            disabled={deleteMutation.isPending}
            className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-50 transition-colors"
            title="Delete Analysis"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
    ));
  };

  const renderDetailedAnalysisRows = (analyses: any[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className="py-8 text-center text-muted-foreground">
            Loading extension logs...
          </td>
        </tr>
      );
    }
    if (!analyses || analyses.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="py-8 text-center text-muted-foreground">
            No logs found.
          </td>
        </tr>
      );
    }
    return analyses.map((item) => {
      const riskColor = item.overallRisk < 40 ? "text-success" : item.overallRisk < 70 ? "text-warning" : "text-danger";

      return (
      <tr key={`detail-${item._id}`} className="transition-colors hover:bg-muted/50">
        <td className="py-4 pr-4 whitespace-nowrap text-muted-foreground text-xs">
          {new Date(item.createdAt).toLocaleString([], {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          })}
        </td>
        <td className="py-4 pr-4">
          <div className="font-medium">{item.userId?.name || "Guest"}</div>
        </td>
        <td className="py-4 pr-4">
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium border border-border">
            {item.platform}
          </span>
        </td>
        <td className="py-4 pr-4">
          <span className={`font-bold ${riskColor}`}>
            {item.overallRisk}/100
          </span>
        </td>
        <td className="py-4 pr-4 max-w-[300px]">
          <Dialog>
            <DialogTrigger asChild>
              <button className="truncate w-full text-left text-muted-foreground hover:text-foreground hover:underline decoration-muted-foreground/30 underline-offset-4 transition-colors focus:outline-none">
                {item.inputText}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Extension Log Details</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-6">
                
                {/* Risk Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg border border-border p-4 bg-card text-center">
                    <div className="text-sm text-muted-foreground mb-1">Overall Risk</div>
                    <div className={`text-3xl font-bold ${riskColor}`}>{item.overallRisk}</div>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-card text-center">
                    <div className="text-sm text-muted-foreground mb-1">Privacy Risk</div>
                    <div className="text-3xl font-bold">{item.privacyRisk ?? '-'}</div>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-card text-center">
                    <div className="text-sm text-muted-foreground mb-1">Professional</div>
                    <div className="text-3xl font-bold">{item.professionalRisk ?? '-'}</div>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-card text-center">
                    <div className="text-sm text-muted-foreground mb-1">Legal Risk</div>
                    <div className="text-3xl font-bold">{item.legalRisk ?? '-'}</div>
                  </div>
                </div>

                {/* Original Text */}
                <div className="rounded-lg border border-border p-4 bg-muted/30">
                  <h3 className="font-semibold mb-2">Original Input</h3>
                  <div className="text-sm whitespace-pre-wrap text-foreground">
                    {item.inputText}
                  </div>
                </div>

                {/* Summary */}
                {item.summary && (
                  <div className="rounded-lg border border-border p-4 bg-card">
                    <h3 className="font-semibold mb-2">AI Summary</h3>
                    <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {item.summary}
                    </div>
                  </div>
                )}

                {/* Risky Phrases */}
                {item.riskyPhrases && item.riskyPhrases.length > 0 && (
                  <div className="rounded-lg border border-border p-4 bg-card">
                    <h3 className="font-semibold mb-3">Identified Risks</h3>
                    <div className="space-y-4">
                      {item.riskyPhrases.map((phrase: any, i: number) => (
                        <div key={i} className="border-l-2 border-danger pl-3">
                          <div className="font-mono text-sm bg-danger/10 text-danger inline-block px-2 py-0.5 rounded mb-1">"{phrase.phrase}"</div>
                          <div className="text-sm text-muted-foreground">{phrase.reason}</div>
                          {phrase.suggestion && (
                            <div className="text-sm text-success mt-1">Suggestion: {phrase.suggestion}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rewrite */}
                {item.rewrite && (
                  <div className="rounded-lg border border-border p-4 bg-success/10 border-success/20">
                    <h3 className="font-semibold mb-2 text-success">Suggested Rewrite</h3>
                    <div className="text-sm whitespace-pre-wrap text-foreground">
                      {item.rewrite}
                    </div>
                  </div>
                )}

              </div>
            </DialogContent>
          </Dialog>
        </td>
        <td className="py-4 pr-4 text-right">
          <button
            onClick={() => deleteMutation.mutate(item._id)}
            disabled={deleteMutation.isPending}
            className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-50 transition-colors"
            title="Delete Log"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
      );
    });
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground pb-20 selection:bg-brand/30">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-brand">
              <Server className="h-4 w-4" />
              <span className="font-semibold tracking-widest uppercase">Server Room</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">System Status</h1>
            <p className="mt-1 text-muted-foreground">
              Monitor platform usage and API token consumption.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted shadow-soft"
          >
            <ArrowLeft className="h-4 w-4" /> Exit
          </Link>
        </div>

        {isStatsLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-glass-border bg-card/50 p-6 animate-pulse"
              />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Top Metrics */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-xl border border-glass-border bg-card p-6 shadow-soft">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <UsersIcon className="h-32 w-32" />
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-muted-foreground">Total Users</h3>
                </div>
                <div className="text-4xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Includes {stats.guestUsersCount} guest IPs
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-glass-border bg-card p-6 shadow-soft">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <Activity className="h-32 w-32" />
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2 text-success">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-muted-foreground">Total Analyses</h3>
                </div>
                <div className="text-4xl font-bold">{stats.totalAnalyses.toLocaleString()}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stats.analysesLast7Days} in the last 7 days
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-glass-border bg-card p-6 shadow-soft">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <Cpu className="h-32 w-32" />
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-accent-purple/10 p-2 text-accent-purple">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-muted-foreground">Tokens Used</h3>
                </div>
                <div className="text-4xl font-bold">{stats.tokenUsage.total.toLocaleString()}</div>
                <div className="mt-2 text-sm text-muted-foreground">Across all API keys</div>
              </div>
            </div>

            {/* Provider Breakdown */}
            <div className="mb-12 rounded-xl border border-glass-border bg-card p-6 shadow-soft">
              <div className="mb-6 flex items-center gap-2">
                <Key className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-bold">API Key Utilization</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.tokenUsage.byProvider.map((provider) => (
                  <div
                    key={provider.providerKey}
                    className="rounded-lg border border-border bg-background p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm font-semibold">
                        {provider.providerKey}
                      </span>
                    </div>
                    <span className="font-bold">
                      {provider.tokens.toLocaleString()}{" "}
                      <span className="text-xs text-muted-foreground font-normal">tokens</span>
                    </span>
                  </div>
                ))}
                {stats.tokenUsage.byProvider.length === 0 && (
                  <div className="text-muted-foreground">No token usage data yet.</div>
                )}
              </div>
            </div>
          </>
        ) : null}

        {/* Main Content Tabs */}
        <Tabs defaultValue="analysis" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="analysis">Live Analysis Stream</TabsTrigger>
            <TabsTrigger value="users">Users Directory</TabsTrigger>
            <TabsTrigger value="extension-logs">Extension Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="animate-in fade-in duration-500">
            <div className="rounded-xl border border-glass-border bg-card p-6 shadow-soft">
              <div className="mb-6 flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-bold">Global Analysis Stream</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Platform</th>
                      <th className="pb-3 font-medium">Snippet</th>
                      <th className="pb-3 font-medium">Risk</th>
                      <th className="pb-3 font-medium text-right">Tokens</th>
                      <th className="pb-3 font-medium text-right">Key</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {renderAnalysisRows(history?.analyses, isHistoryLoading)}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="animate-in fade-in duration-500">
            <div className="rounded-xl border border-glass-border bg-card p-6 shadow-soft">
              <div className="mb-6 flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-bold">Registered Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Provider</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Created At</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isUsersLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          Loading users...
                        </td>
                      </tr>
                    ) : usersData?.users?.length ? (
                      usersData.users.map((u) => (
                        <tr key={u._id} className="transition-colors hover:bg-muted/50">
                          <td className="py-4 pr-4">
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium border border-border capitalize">
                              {u.provider}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            {u.isVerified ? (
                              <span className="text-success text-xs font-medium flex items-center gap-1">
                                Verified
                              </span>
                            ) : (
                              <span className="text-warning text-xs font-medium">Unverified</span>
                            )}
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground text-xs">
                            {new Date(u.createdAt).toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <Dialog onOpenChange={(open) => {
                              if (open) setSelectedUserId(u._id);
                              else setSelectedUserId(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs">
                                  <Clock className="mr-2 h-3 w-3" />
                                  History
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Analysis History — {u.name}</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 overflow-x-auto">
                                  <table className="w-full text-left text-sm">
                                    <thead className="border-b border-border text-muted-foreground">
                                      <tr>
                                        <th className="pb-3 font-medium">Time</th>
                                        <th className="pb-3 font-medium">User</th>
                                        <th className="pb-3 font-medium">Platform</th>
                                        <th className="pb-3 font-medium">Snippet</th>
                                        <th className="pb-3 font-medium">Risk</th>
                                        <th className="pb-3 font-medium text-right">Tokens</th>
                                        <th className="pb-3 font-medium text-right">Key</th>
                                        <th className="pb-3 font-medium text-right">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {renderAnalysisRows(userHistory?.analyses, isUserHistoryLoading)}
                                    </tbody>
                                  </table>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extension-logs" className="animate-in fade-in duration-500">
            <div className="rounded-xl border border-glass-border bg-card p-6 shadow-soft">
              <div className="mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-bold">Detailed Extension Logs</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Platform</th>
                      <th className="pb-3 font-medium">Risk Score</th>
                      <th className="pb-3 font-medium">Log Details (Click to Expand)</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {renderDetailedAnalysisRows(
                      history?.analyses?.filter((a: any) => a.source === "extension"), 
                      isHistoryLoading
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
