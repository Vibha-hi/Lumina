import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Loader2,
  Lock,
  Briefcase,
  MessageSquareWarning,
  Scale,
  TrendingUp,
  Wand2,
  CheckCircle2,
  ArrowRight,
  Copy,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiAnalyzeGuest, type LuminaAnalysis } from "@/lib/api";

const PLATFORMS = ["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "General"];

const STEPS = [
  "Checking Privacy...",
  "Detecting Emotions...",
  "Running Audience Simulation...",
  "Evaluating Reputation...",
  "Generating Suggestions...",
];

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

function riskLabel(v: number) {
  return v < 35 ? "Low Risk" : v < 65 ? "Moderate Risk" : "High Risk";
}

function CircularScore({ value }: { value: number }) {
  const r = 78;
  const c = 2 * Math.PI * r;
  const tone = riskTone(value);
  const colorMap: Record<string, string> = {
    success: "oklch(0.72 0.19 145)",
    warning: "oklch(0.80 0.18 75)",
    danger: "oklch(0.63 0.22 25)",
  };
  const col = colorMap[tone];
  return (
    <div className="relative h-52 w-52">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} className="stroke-white/10" strokeWidth="14" fill="none" />
        <defs>
          <linearGradient id="ovGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={col} />
            <stop offset="100%" stopColor={col} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <motion.circle
          cx="90"
          cy="90"
          r={r}
          stroke="url(#ovGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={cn("text-5xl font-bold", TONE_TEXT[tone])}>{value}%</div>
          <div className="text-sm text-muted-foreground mt-1">{riskLabel(value)}</div>
        </div>
      </div>
    </div>
  );
}

export function DemoSection() {
  const [platform, setPlatform] = useState("LinkedIn");
  const [text, setText] = useState(
    "My manager is completely useless and has no idea what they're doing. This company is a total joke.",
  );
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<LuminaAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const analyze = async () => {
    if (text.trim().length < 4) return;
    setLoading(true);
    setError(null);
    setActiveStep(0);
    setResult(null);

    // Animate through steps while the real API call runs
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 600);

    try {
      const data = await apiAnalyzeGuest(text, platform);
      clearInterval(stepInterval);
      setActiveStep(STEPS.length);
      setResult(data.analysis);
      setSelectedVariant(0);
      setTimeout(
        () =>
          document.getElementById("demo-results")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100,
      );
    } catch (e) {
      clearInterval(stepInterval);
      const msg = e instanceof Error ? e.message : "Analysis failed. Please try again.";
      // Check if this is the guest limit error (403)
      if (msg.toLowerCase().includes("free analysis") || msg.toLowerCase().includes("create an account")) {
        setShowLimitModal(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="demo" className="relative py-24 sm:py-32">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold tracking-tight"
            >
              Try It <span className="gradient-text">Yourself</span>
            </motion.h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Paste your post and let AI simulate the consequences before you publish.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-6 sm:p-8 shadow-glow"
          >
            {/* platforms */}
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

            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your post here..."
                className="w-full min-h-[160px] resize-none rounded-2xl bg-background/40 border border-glass-border p-4 text-base outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Posting to <span className="text-foreground font-medium">{platform}</span>
                </span>
                <span>{text.length} characters</span>
              </div>
            </div>

            <button
              onClick={analyze}
              disabled={loading || text.trim().length < 4}
              className="mt-6 w-full h-14 rounded-2xl gradient-brand text-white font-semibold shadow-glow hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing with LUMINA.AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Analyze with AI
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 space-y-2"
                >
                  {STEPS.map((s, i) => (
                    <motion.div
                      key={s}
                      className={cn(
                        "flex items-center gap-3 text-sm px-3 py-2 rounded-lg",
                        i < activeStep
                          ? "text-success"
                          : i === activeStep
                            ? "text-foreground glass"
                            : "text-muted-foreground/60",
                      )}
                    >
                      {i < activeStep ? (
                        <span className="h-4 w-4 rounded-full bg-success/20 grid place-items-center text-success">
                          ✓
                        </span>
                      ) : i === activeStep ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-current" />
                      )}
                      {s}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {result && (
          <motion.div
            id="demo-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6 pb-24"
          >
            {/* ── Overall Risk + Risk Cards ── */}
            <section className="relative">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <SectionHead eyebrow="AI Analysis" title="Your post through an AI lens" />
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center">
                    <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                      Overall Risk
                    </div>
                    <CircularScore value={result.overall_risk} />
                  </div>

                  <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                    {[
                      { key: "privacy", label: "Privacy Risk", icon: Lock, val: result.privacy_risk },
                      { key: "professional", label: "Professional Risk", icon: Briefcase, val: result.professional_risk },
                      { key: "misunderstanding", label: "Misunderstanding", icon: MessageSquareWarning, val: result.misunderstanding_risk },
                      { key: "legal", label: "Legal Risk", icon: Scale, val: result.legal_risk },
                    ].map((r, i) => {
                      const tone = riskTone(r.val);
                      return (
                        <motion.div
                          key={r.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          whileHover={{ y: -4 }}
                          className="glass rounded-2xl p-5 hover:shadow-glow transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={cn("h-10 w-10 rounded-xl grid place-items-center bg-white/5", TONE_TEXT[tone])}>
                              <r.icon className="h-5 w-5" />
                            </div>
                            <span className={cn("text-xl font-bold", TONE_TEXT[tone])}>{r.val}%</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm font-medium">{r.label}</div>
                            {r.key === "misunderstanding" && result.misunderstanding_breakdown && (
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
                                  <div className="font-semibold mb-2 text-primary">Context &amp; Misunderstanding</div>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {result.misunderstanding_breakdown}
                                  </p>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${r.val}%` }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.06 }}
                              className={cn("h-full", TONE_BG[tone])}
                            />
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* AI Summary */}
                    <div className="sm:col-span-2 glass rounded-2xl p-5 border border-primary/30 bg-primary/5">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-brand grid place-items-center shrink-0">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="text-xs uppercase text-muted-foreground tracking-wider mb-3">
                            AI Summary
                          </div>
                          <div className="space-y-3">
                            {result.summary
                              .split("\n")
                              .filter((s) => s.trim().length > 0)
                              .map((line, i) => {
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

                    {/* Reach Potential */}
                    <div className="sm:col-span-2 glass rounded-2xl p-5 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl grid place-items-center bg-white/5 text-primary">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Reach potential</div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.reach_potential}%` }}
                            transition={{ duration: 1 }}
                            className="h-full gradient-brand"
                          />
                        </div>
                      </div>
                      <span className="text-xl font-bold gradient-text">{result.reach_potential}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Emotion Radar + Audience Simulation ── */}
            <section className="relative">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                  {/* Emotion Radar */}
                  <div className="space-y-6">
                    <div className="glass-strong rounded-3xl p-6 h-96">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Emotional fingerprint
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <RadarChart data={result.emotions}>
                          <defs>
                            <linearGradient id="demoRadar" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="oklch(0.66 0.19 255)" stopOpacity={0.7} />
                              <stop offset="100%" stopColor="oklch(0.63 0.22 295)" stopOpacity={0.7} />
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="oklch(1 0 0 / 0.15)" />
                          <PolarAngleAxis
                            dataKey="emotion"
                            tick={{ fill: "oklch(0.72 0.02 255)", fontSize: 12 }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            dataKey="value"
                            stroke="oklch(0.66 0.19 255)"
                            strokeWidth={2}
                            fill="url(#demoRadar)"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Grammar Fixes */}
                    {result.grammar_fixes && result.grammar_fixes.length > 0 && (
                      <div className="glass-strong rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            Grammar &amp; Tone Helper
                          </div>
                          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                            <CheckCircle2 className="h-3 w-3" /> Slang ignored
                          </div>
                        </div>
                        <div className="space-y-3">
                          {result.grammar_fixes.map((fix, i) => (
                            <div key={i} className="glass rounded-2xl p-4">
                              <div className="text-sm flex items-center gap-2 flex-wrap">
                                <span className="bg-danger/20 text-danger px-1.5 rounded-md line-through">
                                  {fix.original}
                                </span>
                                <span className="text-muted-foreground/50">➔</span>
                                <span className="text-success font-medium">{fix.corrected}</span>
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground">{fix.explanation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Audience Simulation */}
                  <div className="glass-strong rounded-3xl p-6">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                      Audience simulation
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {result.personas.map((p) => (
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
              </div>
            </section>

            {/* ── Risky Phrases ── */}
            {result.risky_phrases.length > 0 && (
              <section className="relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                  <div className="glass-strong rounded-3xl p-6">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                      Risky phrases
                    </div>
                    <div className="space-y-3">
                      {result.risky_phrases.map((r, i) => (
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
                </div>
              </section>
            )}

            {/* ── AI Rewrite Variants ── */}
            <section className="relative">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="glass-strong rounded-3xl p-6 border border-success/30">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-success mb-4">
                    <Wand2 className="h-3.5 w-3.5" /> AI-rewritten drafts
                  </div>

                  {result.rewrite_variants && result.rewrite_variants.length > 0 ? (
                    <div>
                      <div className="flex gap-2 mb-4">
                        {result.rewrite_variants.map((v, i) => (
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
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">
                              {result.rewrite_variants[selectedVariant]?.label} tone
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  result.rewrite_variants![selectedVariant]?.text || "",
                                );
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                            >
                              <Copy className="h-3 w-3" />
                              {copied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <p className="text-base leading-relaxed">
                            {result.rewrite_variants[selectedVariant]?.text}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <p className="text-base leading-relaxed">{result.rewrite}</p>
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest limit reached modal */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowLimitModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative glass-strong rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-glow border border-glass-border text-center"
            >
              <button
                onClick={() => setShowLimitModal(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-lg glass grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="h-16 w-16 rounded-2xl gradient-brand grid place-items-center shadow-glow mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-2">
                Free Analyses <span className="gradient-text">Used Up</span>
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                You've used all 3 free guest analyses. Sign in or create an account to get unlimited AI-powered post analysis.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/auth"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl gradient-brand text-white font-semibold shadow-glow hover:brightness-110 transition-all text-sm"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "signup" } as any}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl glass-strong border border-glass-border font-semibold hover:shadow-glow transition-all text-sm"
                >
                  <UserPlus className="h-4 w-4" /> Create Account
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1 text-xs text-muted-foreground mb-4">
        {eyebrow}
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}
