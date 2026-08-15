import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Scale,
  Lock,
  Briefcase,
  MessageSquareWarning,
  TrendingUp,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { apiCompare, type CompareResult } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiLogout } from "@/lib/api";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Settings,
  LogOut,
  CheckCircle2,
  LayoutDashboard,
  Home,
  Mail,
} from "lucide-react";
import { FeedbackDialog } from "@/components/site/FeedbackDialog";

export const Route = createFileRoute("/_authenticated/compare")({
  head: () => ({
    meta: [
      { title: "Compare Drafts — LUMINA.AI" },
      {
        name: "description",
        content: "Compare two post drafts side-by-side to see which is safer.",
      },
    ],
  }),
  component: CompareDrafts,
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

function calculateSimilarity(str1: string, str2: string) {
  const words1 = str1.toLowerCase().match(/\b(\w+)\b/g) || [];
  const words2 = str2.toLowerCase().match(/\b(\w+)\b/g) || [];
  if (!words1.length && !words2.length) return 100;
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  if (union.size === 0) return 0;
  return Math.round((intersection.size / union.size) * 100);
}

function CompareDrafts() {
  const [draftA, setDraftA] = useState("");
  const [draftB, setDraftB] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [result, setResult] = useState<CompareResult | null>(null);
  const { user } = useSession();
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const compareM = useMutation({
    mutationFn: (input: { draftA: string; draftB: string; platform: string }) =>
      apiCompare(input.draftA, input.draftB, input.platform),
    onSuccess: (res) => {
      setResult(res);
      setTimeout(
        () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Comparison failed"),
  });

  return (
    <div className="relative min-h-screen pt-24 pb-24">
      <Toaster theme="dark" position="top-center" />
      <div className="absolute inset-0 mesh-bg opacity-40" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Top bar */}
      <div className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-glass-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: "/dashboard" })}
              className="h-9 w-9 rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <a href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-glow">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="hidden sm:inline font-display font-semibold text-lg">
                LUMINA<span className="gradient-text">.AI</span>
              </span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Link
                  to="/"
                  className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg glass text-sm font-medium hover:shadow-glow hover:bg-white/5 transition-all"
                >
                  <Home className="h-4 w-4" /> Home
                </Link>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg glass text-sm font-medium hover:shadow-glow hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" /> Single Analysis
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all outline-none ring-0 focus:ring-2 focus:ring-primary/30">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.avatar_url || ""} />
                        <AvatarFallback className="bg-white/5 text-sm font-semibold gradient-text">
                          {user?.name?.charAt(0).toUpperCase() ||
                            user?.email?.charAt(0).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 glass-strong border-glass-border"
                  >
                    <DropdownMenuLabel className="font-normal px-3 py-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">{user?.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5">
                      <Link to="/dashboard" hash="settings" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-white/5"
                      onSelect={() => {
                        setTimeout(() => setIsFeedbackOpen(true), 100);
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Send feedback</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-400 hover:bg-red-400/10"
                      onClick={() => {
                        apiLogout();
                        window.location.href = "/";
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Compare <span className="gradient-text">Drafts</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            See which version of your post is safer and more effective before publishing.
          </p>
        </motion.div>

        {/* Inputs */}
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                Draft A
              </label>
              <textarea
                value={draftA}
                onChange={(e) => setDraftA(e.target.value)}
                placeholder="Paste the first draft here..."
                className="w-full min-h-[180px] resize-none rounded-2xl bg-background/40 border border-glass-border p-4 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                Draft B
              </label>
              <textarea
                value={draftB}
                onChange={(e) => setDraftB(e.target.value)}
                placeholder="Paste the second draft here..."
                className="w-full min-h-[180px] resize-none rounded-2xl bg-background/40 border border-glass-border p-4 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => compareM.mutate({ draftA, draftB, platform })}
            disabled={compareM.isPending || draftA.trim().length < 4 || draftB.trim().length < 4}
            className="mt-6 w-full h-14 rounded-2xl gradient-brand text-white font-semibold shadow-glow hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {compareM.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Comparing Drafts...
              </>
            ) : (
              <>
                <Scale className="h-5 w-5" /> Compare Drafts
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-8"
            >
              <div
                className={cn(
                  "glass-strong rounded-3xl p-8 border-2 shadow-glow text-center",
                  result.winner === "A" ? "border-primary/50" : "border-success/50",
                )}
              >
                <div className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
                  Optimum Draft
                </div>
                <h2 className="text-4xl font-bold gradient-text mb-4">
                  Draft {result.winner} is the optimum choice
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {result.winner_reasoning}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Draft A Results */}
                <div
                  className={cn(
                    "space-y-6 glass-strong rounded-3xl p-6",
                    result.winner === "A" ? "ring-2 ring-primary/40" : "",
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Draft A Analysis</h3>
                    <div className="text-sm font-medium px-3 py-1 bg-white/5 rounded-full">
                      Overall Risk:{" "}
                      <span className={cn(TONE_TEXT[riskTone(result.draft_a.overall_risk)])}>
                        {result.draft_a.overall_risk}%
                      </span>
                    </div>
                  </div>

                  <RiskCard label="Privacy Risk" icon={Lock} val={result.draft_a.privacy_risk} />
                  <RiskCard
                    label="Professional Risk"
                    icon={Briefcase}
                    val={result.draft_a.professional_risk}
                  />
                  <RiskCard
                    label="Misunderstanding"
                    icon={MessageSquareWarning}
                    val={result.draft_a.misunderstanding_risk}
                    breakdown={result.draft_a.misunderstanding_breakdown}
                  />
                  <RiskCard label="Legal Risk" icon={Scale} val={result.draft_a.legal_risk} />

                  <div className="glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl grid place-items-center bg-white/5 text-primary">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Reach potential</div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                        <div
                          className="h-full gradient-brand"
                          style={{ width: `${result.draft_a.reach_potential}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xl font-bold gradient-text">
                      {result.draft_a.reach_potential}%
                    </span>
                  </div>
                </div>

                {/* Draft B Results */}
                <div
                  className={cn(
                    "space-y-6 glass-strong rounded-3xl p-6",
                    result.winner === "B" ? "ring-2 ring-success/40" : "",
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Draft B Analysis</h3>
                    <div className="text-sm font-medium px-3 py-1 bg-white/5 rounded-full">
                      Overall Risk:{" "}
                      <span className={cn(TONE_TEXT[riskTone(result.draft_b.overall_risk)])}>
                        {result.draft_b.overall_risk}%
                      </span>
                    </div>
                  </div>

                  <RiskCard label="Privacy Risk" icon={Lock} val={result.draft_b.privacy_risk} />
                  <RiskCard
                    label="Professional Risk"
                    icon={Briefcase}
                    val={result.draft_b.professional_risk}
                  />
                  <RiskCard
                    label="Misunderstanding"
                    icon={MessageSquareWarning}
                    val={result.draft_b.misunderstanding_risk}
                    breakdown={result.draft_b.misunderstanding_breakdown}
                  />
                  <RiskCard label="Legal Risk" icon={Scale} val={result.draft_b.legal_risk} />

                  <div className="glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl grid place-items-center bg-white/5 text-primary">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Reach potential</div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                        <div
                          className="h-full gradient-brand"
                          style={{ width: `${result.draft_b.reach_potential}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xl font-bold gradient-text">
                      {result.draft_b.reach_potential}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Context Match Similarity Bar */}
              <div className="glass-strong rounded-3xl p-8 shadow-glow text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl grid place-items-center bg-white/5 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold">Context Match</h3>
                  </div>
                  <span className="text-3xl font-bold gradient-text">
                    {calculateSimilarity(draftA, draftB)}%
                  </span>
                </div>
                <div className="text-sm text-left text-muted-foreground mb-4">
                  Similarity between Draft A and Draft B based on shared context and phrasing.
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateSimilarity(draftA, draftB)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full gradient-brand"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FeedbackDialog isOpen={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
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
  icon: any;
  val: number;
  breakdown?: string;
}) {
  const tone = riskTone(val);
  return (
    <div className="glass rounded-2xl p-5">
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
    </div>
  );
}
