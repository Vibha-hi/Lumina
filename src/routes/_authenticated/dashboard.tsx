import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Trash2,
  LogOut,
  Sparkle,
  TrendingUp,
  Lock,
  Briefcase,
  MessageSquareWarning,
  Scale,
  Wand2,
  CheckCircle2,
  Settings,
  Mail,
  User,
  Copy,
  ArrowLeft,
  Server,
  Home,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { toast, Toaster } from "sonner";
import {
  apiAnalyze,
  apiListHistory,
  apiDeleteHistory,
  apiLogout,
  apiUpdateProfile,
  apiDeleteAccount,
  apiListComparisons,
  apiDeleteComparison,
  type LuminaAnalysis,
  type HistoryItem,
  type RewriteVariant,
  type SavedComparison,
} from "@/lib/api";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/site/SettingsDialog";
import { FeedbackDialog } from "@/components/site/FeedbackDialog";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LUMINA.AI" },
      { name: "description", content: "Your saved post analyses and AI insights." },
    ],
  }),
  component: Dashboard,
});

const PLATFORMS = ["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "General"];
const TONE_TEXT: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  brand: "text-primary",
};
const TONE_BG: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  brand: "gradient-brand",
};

function riskTone(v: number) {
  return v < 35 ? "success" : v < 65 ? "warning" : "danger";
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const { user } = useSession();

  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [current, setCurrent] = useState<LuminaAnalysis | null>(null);
  const [historyItemView, setHistoryItemView] = useState<{ analysis: LuminaAnalysis, text: string, platform: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  useEffect(() => {
    if (location.hash === "settings") {
      setIsSettingsOpen(true);
      navigate({ hash: "", replace: true });
    }
  }, [location.hash, navigate]);

  const [historyTab, setHistoryTab] = useState<"posts" | "comparisons">("posts");

  const historyQ = useQuery({
    queryKey: ["history"],
    queryFn: apiListHistory,
  });

  const comparisonsQ = useQuery({
    queryKey: ["comparisons"],
    queryFn: apiListComparisons,
  });

  const analyzeM = useMutation({
    mutationFn: (input: { text: string; platform: string }) =>
      apiAnalyze(input.text, input.platform),
    onSuccess: (res) => {
      setCurrent(res.analysis);

      qc.invalidateQueries({ queryKey: ["history"] });
      setTimeout(
        () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Analysis failed"),
  });

  const deleteM = useMutation({
    mutationFn: apiDeleteHistory,
    onSuccess: () => {
      toast.success("Analysis deleted");
      qc.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const deleteComparisonM = useMutation({
    mutationFn: apiDeleteComparison,
    onSuccess: () => {
      toast.success("Comparison deleted");
      qc.invalidateQueries({ queryKey: ["comparisons"] });
    },
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    apiLogout();
    navigate({ to: "/auth", replace: true });
  };

  /** Reconstruct a LuminaAnalysis from a HistoryItem so we can display it */
  const loadFromHistory = (item: HistoryItem) => {
    // Convert DB field names to the Groq response shape
    const variants: RewriteVariant[] = Array.isArray(item.rewriteVariants)
      ? (item.rewriteVariants as RewriteVariant[])
      : [];

    const analysis: LuminaAnalysis = {
      overall_risk: item.overallRisk,
      privacy_risk: item.privacyRisk ?? 0,
      professional_risk: item.professionalRisk ?? 0,
      misunderstanding_risk: item.misunderstandingRisk ?? 0,
      legal_risk: item.legalRisk ?? 0,
      reach_potential: item.reachPotential ?? 0,
      emotions: item.emotions ?? [],
      personas: item.personas ?? [],
      risky_phrases: item.riskyPhrases ?? [],
      rewrite: item.rewrite ?? "",
      rewrite_variants: variants,
      summary: item.summary ?? "",
      misunderstanding_breakdown: item.misunderstanding_breakdown ?? undefined,
      grammar_fixes:
        item.grammarIssues?.map((g) => ({
          original: g.original,
          corrected: g.suggestion,
          explanation: g.explanation,
        })) ?? [],
    };
    setHistoryItemView({ analysis, text: item.inputText, platform: item.platform });
  };

  return (
    <div className="relative min-h-screen pt-24 pb-24">
      <Toaster theme="dark" position="top-center" />


      {/* Top bar */}
      <div className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-glass-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-lg">
              LUMINA<span className="gradient-text">.AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg glass text-sm font-medium hover:shadow-glow hover:bg-white/5 transition-all"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              to="/compare"
              className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg glass text-sm font-medium hover:shadow-glow hover:bg-white/5 transition-all"
            >
              <Scale className="h-4 w-4" /> Compare
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all outline-none ring-0 focus:ring-2 focus:ring-primary/30">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={""} />
                    <AvatarFallback className="bg-white/5 text-sm font-semibold gradient-text">
                      {user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 glass-strong border-glass-border">
                <DropdownMenuLabel className="font-normal px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-white/5 px-3 py-2.5 gap-3"
                  onSelect={() => {
                    setTimeout(() => setIsSettingsOpen(true), 100);
                  }}
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">Settings</div>
                    <div className="text-[11px] text-muted-foreground">Account preferences</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-white/5 px-3 py-2.5 gap-3"
                  onSelect={() => {
                    setTimeout(() => setIsFeedbackOpen(true), 100);
                  }}
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">Send feedback</div>
                    <div className="text-[11px] text-muted-foreground">Help us improve LUMINA</div>
                  </div>
                </DropdownMenuItem>

                {user?.role === "admin" && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <Link to="/admin">
                      <DropdownMenuItem className="cursor-pointer hover:bg-white/5 px-3 py-2.5 gap-3">
                        <Server className="h-4 w-4 text-brand" />
                        <div>
                          <div className="text-sm">Server Room</div>
                          <div className="text-[11px] text-muted-foreground">Admin dashboard</div>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}

                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 hover:bg-red-400/10 hover:text-red-300 focus:bg-red-400/10 focus:text-red-300 px-3 py-2.5 gap-3"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Analyze a <span className="gradient-text">draft post</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Powered by Gemini AI. Every analysis is saved to your private history below.
          </p>
        </motion.div>

        {/* Analyzer */}
        <div className="mt-10 glass-strong rounded-3xl p-6 sm:p-8 shadow-glow">
          <div className="glass rounded-xl p-1 flex flex-wrap gap-1 mb-6">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  "flex-1 min-w-20 px-3 py-2 text-sm rounded-lg transition-all",
                  platform === p
                    ? "gradient-brand text-white shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or write the post you're considering..."
            className="w-full min-h-[180px] resize-none rounded-2xl bg-background/40 border border-glass-border p-4 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Posting to <span className="text-foreground font-medium">{platform}</span>
            </span>
            <span>{text.length} characters</span>
          </div>

          <button
            onClick={() => analyzeM.mutate({ text, platform })}
            disabled={analyzeM.isPending || text.trim().length < 4}
            className="mt-6 w-full h-14 rounded-2xl gradient-brand text-white font-semibold shadow-glow hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {analyzeM.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Analyzing with LUMINA.AI...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Analyze &amp; save
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {current && (
            <motion.div
              id="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-6"
            >
              <AnalysisResultsView current={current} />
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog open={!!historyItemView} onOpenChange={(open) => !open && setHistoryItemView(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass-strong border-glass-border p-6 sm:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Analysis for {historyItemView?.platform}</DialogTitle>
              <DialogDescription className="mt-2 bg-background/50 p-3 rounded-lg border border-glass-border text-foreground/80 italic">
                "{historyItemView?.text}"
              </DialogDescription>
            </DialogHeader>
            {historyItemView && <AnalysisResultsView current={historyItemView.analysis} />}
          </DialogContent>
        </Dialog>
        {/* History */}
        <div className="mt-16">
          <div className="flex sm:items-center justify-between flex-col sm:flex-row mb-6 gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Your history</h2>
            <div className="glass rounded-xl p-1 flex items-center w-fit">
              <button
                onClick={() => setHistoryTab("posts")}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg font-medium transition-all",
                  historyTab === "posts"
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                Single Posts
              </button>
              <button
                onClick={() => setHistoryTab("comparisons")}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg font-medium transition-all",
                  historyTab === "comparisons"
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                Comparisons
              </button>
            </div>
          </div>

          {historyTab === "posts" &&
            (historyQ.isLoading ? (
              <div className="text-muted-foreground text-sm">Loading posts...</div>
            ) : historyQ.data && historyQ.data.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyQ.data.map((a) => {
                  const tone = riskTone(a.overallRisk);
                  return (
                    <motion.div
                      key={a._id || a.id}
                      whileHover={{ y: -4 }}
                      className="glass rounded-2xl p-5 hover:shadow-glow transition-all cursor-pointer group"
                      onClick={() => loadFromHistory(a)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {a.platform}
                        </span>
                        <span className={cn("text-lg font-bold", TONE_TEXT[tone])}>
                          {a.overallRisk}%
                        </span>
                      </div>
                      <p className="text-sm line-clamp-3 mb-3 group-hover:text-foreground transition-colors">
                        {a.inputText}
                      </p>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                        <div
                          className={cn("h-full", TONE_BG[tone])}
                          style={{ width: `${a.overallRisk}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                            View analysis →
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteM.mutate(a._id || a.id);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="glass rounded-3xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center border-dashed border-2 border-white/5">
                <Sparkles className="h-8 w-8 mb-4 opacity-50" />
                <p>No post analyses yet. Analyze your first post above!</p>
              </div>
            ))}

          {historyTab === "comparisons" &&
            (comparisonsQ.isLoading ? (
              <div className="text-muted-foreground text-sm">Loading comparisons...</div>
            ) : comparisonsQ.data && comparisonsQ.data.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparisonsQ.data.map((c) => {
                  return (
                    <motion.div
                      key={c._id || c.id}
                      whileHover={{ y: -4 }}
                      className="glass rounded-2xl p-5 hover:shadow-glow transition-all cursor-pointer group"
                      onClick={() =>
                        navigate({ to: "/compare", search: { historyId: c._id || c.id } as any })
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {c.platform}
                        </span>
                        <div className="flex items-center gap-2 rounded-full bg-white/5 border border-glass-border px-3 py-1 text-xs font-medium text-foreground">
                          Optimum: Draft {c.winner}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="glass bg-white/5 rounded-lg p-2 overflow-hidden relative">
                          <div className="text-[10px] uppercase text-muted-foreground mb-1 font-bold">
                            Draft A
                          </div>
                          <p className="text-[11px] line-clamp-3 text-muted-foreground">
                            {c.draftA}
                          </p>
                          {c.winner === "A" && (
                            <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-success" />
                          )}
                        </div>
                        <div className="glass bg-white/5 rounded-lg p-2 overflow-hidden relative">
                          <div className="text-[10px] uppercase text-muted-foreground mb-1 font-bold">
                            Draft B
                          </div>
                          <p className="text-[11px] line-clamp-3 text-muted-foreground">
                            {c.draftB}
                          </p>
                          {c.winner === "B" && (
                            <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-success" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                            View →
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteComparisonM.mutate(c._id || c.id);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="glass rounded-3xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center border-dashed border-2 border-white/5">
                <Scale className="h-8 w-8 mb-4 opacity-50" />
                <p>No comparisons yet. Go to the Compare page to test variants!</p>
              </div>
            ))}
        </div>
      </div>
      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <FeedbackDialog isOpen={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
    </div>
  );
}

function RiskCircle({ value }: { value: number }) {
  const r = 78;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-52 w-52">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} className="stroke-white/10" strokeWidth="14" fill="none" />
        <defs>
          <linearGradient id="dashScoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.71 0.14 231)" />
            <stop offset="100%" stopColor="oklch(0.82 0.13 220)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="90"
          cy="90"
          r={r}
          stroke="url(#dashScoreGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-5xl font-bold gradient-text">{value}%</div>
          <div className="text-sm text-muted-foreground mt-1">
            {value < 35 ? "Low Risk" : value < 65 ? "Moderate" : "High Risk"}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskCard({
  label,
  icon: Icon,
  val,
  breakdown,
}: {
  label: string;
  icon: typeof Lock;
  val: number;
  breakdown?: string;
}) {
  const tone = riskTone(val);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 hover:shadow-glow transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn("h-10 w-10 rounded-xl grid place-items-center bg-white/5", TONE_TEXT[tone])}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn("text-xl font-bold", TONE_TEXT[tone])}>{val}%</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-sm font-medium">{label}</div>
        {breakdown && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-6 px-2.5 py-0 text-[10px] uppercase tracking-wider font-bold rounded-md hover:bg-primary/20 hover:text-primary transition-colors"
              >
                Why?
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 text-sm">
              <div className="font-semibold mb-2 text-primary">Context & Misunderstanding</div>
              <p className="text-muted-foreground leading-relaxed">{breakdown}</p>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={cn("h-full", TONE_BG[tone])} style={{ width: `${val}%` }} />
      </div>
    </motion.div>
  );
}

function AnalysisResultsView({ current }: { current: LuminaAnalysis }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  useEffect(() => {
    setSelectedVariant(0);
  }, [current]);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
                <div className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Overall Risk
                  </div>
                  <RiskCircle value={current.overall_risk} />
                </div>
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                  <RiskCard label="Privacy" icon={Lock} val={current.privacy_risk} />
                  <RiskCard label="Professional" icon={Briefcase} val={current.professional_risk} />
                  <RiskCard
                    label="Misunderstanding"
                    icon={MessageSquareWarning}
                    val={current.misunderstanding_risk}
                    breakdown={current.misunderstanding_breakdown}
                  />
                  <RiskCard label="Legal" icon={Scale} val={current.legal_risk} />
                  <div className="sm:col-span-2 glass rounded-2xl p-5 border border-primary/30 bg-primary/5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl gradient-brand grid place-items-center shrink-0">
                        <Sparkle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="text-xs uppercase text-muted-foreground tracking-wider mb-3">
                          AI Summary
                        </div>
                        <div className="space-y-3">
                          {current.summary
                            .split("\n")
                            .filter((s) => s.trim().length > 0)
                            .map((line, i) => {
                              // Extract title (between **) and description
                              const match = line.match(
                                /^[-*]?\s*(?:\*\*(.*?)\*\*|\*(.*?)\*|([^:]+)):\s*(.*)/,
                              );
                              if (match) {
                                const title = match[1] || match[2] || match[3];
                                const desc = match[4];
                                return (
                                  <div
                                    key={i}
                                    className="flex gap-2 text-sm items-start bg-white/5 rounded-xl p-3 border border-white/5"
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <div>
                                      <span className="font-semibold text-foreground">
                                        {title.trim()}:{" "}
                                      </span>
                                      <span className="text-muted-foreground leading-relaxed">
                                        {desc.trim()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                              // Fallback for lines without a clear title:desc format
                              return (
                                <div
                                  key={i}
                                  className="flex gap-2 text-sm items-start bg-white/5 rounded-xl p-3 border border-white/5"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                  <span className="text-muted-foreground leading-relaxed">
                                    {line.replace(/^[-*]\s*/, "").trim()}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2 glass rounded-2xl p-5 flex items-center gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl grid place-items-center bg-white/5 text-primary",
                      )}
                    >
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Reach potential</div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                        <div
                          className="h-full gradient-brand"
                          style={{ width: `${current.reach_potential}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xl font-bold gradient-text">
                      {current.reach_potential}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                  <div className="glass-strong rounded-3xl p-6 h-96">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      Emotional fingerprint
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                      <RadarChart data={current.emotions}>
                        <defs>
                          <linearGradient id="dashRadar" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="oklch(0.71 0.14 231)" stopOpacity={0.7} />
                            <stop
                              offset="100%"
                              stopColor="oklch(0.82 0.13 220)"
                              stopOpacity={0.7}
                            />
                          </linearGradient>
                        </defs>
                        <PolarGrid stroke="oklch(1 0 0 / 0.15)" />
                        <PolarAngleAxis
                          dataKey="emotion"
                          tick={{ fill: "oklch(0.75 0.03 230)", fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          dataKey="value"
                          stroke="oklch(0.71 0.14 231)"
                          strokeWidth={2}
                          fill="url(#dashRadar)"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {current.grammar_fixes && current.grammar_fixes.length > 0 && (
                    <div className="glass-strong rounded-3xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          Grammar & Tone Helper
                        </div>
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                          <CheckCircle2 className="h-3 w-3" /> Slang ignored
                        </div>
                      </div>
                      <div className="space-y-3">
                        {current.grammar_fixes.map((fix, i) => (
                          <div key={i} className="glass rounded-2xl p-4">
                            <div className="text-sm flex items-center gap-2 flex-wrap">
                              <span className="bg-danger/20 text-danger px-1.5 rounded-md line-through">
                                {fix.original}
                              </span>
                              <span className="text-muted-foreground/50">➔</span>
                              <span className="text-success font-medium">{fix.corrected}</span>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {fix.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="glass-strong rounded-3xl p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                    Audience simulation
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {current.personas.map((p) => (
                      <div key={p.name} className="glass rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{p.avatar}</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold">{p.name}</div>
                            <div className={cn("text-xs font-bold", TONE_TEXT[p.tone])}>
                              {p.risk}%
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          "{p.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {current.risky_phrases.length > 0 && (
                <div className="glass-strong rounded-3xl p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                    Risky phrases
                  </div>
                  <div className="space-y-3">
                    {current.risky_phrases.map((r, i) => (
                      <div key={i} className="glass rounded-2xl p-4">
                        <div className="text-sm">
                          <span className="bg-danger/20 text-danger px-1.5 rounded-md">
                            {r.phrase}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{r.reason}</div>
                        <div className="mt-1 text-xs">
                          <span className="text-success font-medium">Suggestion:</span>{" "}
                          {r.suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-strong rounded-3xl p-6 border border-success/30">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-success mb-4">
                  <Wand2 className="h-3.5 w-3.5" /> AI-rewritten drafts
                </div>

                {/* Show variant tabs if available */}
                {current.rewrite_variants && current.rewrite_variants.length > 0 ? (
                  <div>
                    <div className="flex gap-2 mb-4">
                      {current.rewrite_variants.map((v, i) => (
                        <button
                          key={v.tone}
                          onClick={() => setSelectedVariant(i)}
                          className={cn(
                            "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                            selectedVariant === i
                              ? "gradient-brand text-white shadow-glow"
                              : "glass text-muted-foreground hover:text-foreground hover:bg-white/5",
                          )}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {v.tone === "professional" && "💼"}
                            {v.tone === "friendly" && "😊"}
                            {v.tone === "cautious" && "🛡️"}
                            {v.label}
                          </div>
                        </button>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedVariant}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="glass rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">
                              {current.rewrite_variants[selectedVariant]?.label} tone
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                current.rewrite_variants![selectedVariant]?.text || "",
                              );
                              toast.success("Copied to clipboard!");
                            }}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        </div>
                        <p className="text-base leading-relaxed">
                          {current.rewrite_variants[selectedVariant]?.text}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Fallback: show the single rewrite */
                  <p className="text-base leading-relaxed">{current.rewrite}</p>
                )}
              </div>
    </div>
  );
}
