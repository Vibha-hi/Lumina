import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PenLine, Brain, Sparkles, ArrowRight, Zap, ShieldCheck, Eye } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it Works — LUMINA.AI" },
      {
        name: "description",
        content:
          "Paste, analyze, improve. Three steps from draft to responsible post — powered by LUMINA.AI.",
      },
      { property: "og:title", content: "How LUMINA.AI Works" },
      {
        property: "og:description",
        content: "Three steps between 'I want to post this' and 'I know what will happen.'",
      },
    ],
  }),
  component: HowPage,
});

const STEPS = [
  {
    n: "01",
    icon: PenLine,
    title: "Paste",
    desc: "Drop in a tweet, article, LinkedIn post, YouTube description — or use our browser extension to analyze text anywhere.",
  },
  {
    n: "02",
    icon: Brain,
    title: "Analyze",
    desc: "LUMINA.AI runs emotion, privacy, legal, and reach checks in parallel.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Improve",
    desc: "Review inline warnings, then pick a safer, professional, or friendlier AI rewrite — intent preserved.",
  },
];

const PILLARS = [
  {
    icon: Zap,
    title: "Real-time",
    desc: "Analysis completes in seconds so it fits into how you already write.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    desc: "Your drafts are never stored without consent. No tracking, no ad profiles.",
  },
  {
    icon: Eye,
    title: "Explains everything",
    desc: "Every warning includes a plain-language reason and a concrete suggestion.",
  },
];

function HowPage() {
  return (
    <PageShell
      eyebrow="How LUMINA.AI works"
      title={
        <>
          Three steps to <span className="gradient-text">post responsibly.</span>
        </>
      }
      subtitle="No new muscle memory required. LUMINA.AI meets you where you already write."
    >
      <section className="pb-16 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 relative">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative glass-strong rounded-3xl p-8 hover:shadow-glow transition-all group"
              >
                <div className="text-6xl font-bold gradient-text opacity-40 mb-2">{s.n}</div>
                <div className="h-14 w-14 rounded-2xl gradient-brand grid place-items-center shadow-glow mb-5 group-hover:scale-110 transition-transform">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-semibold mb-2">{s.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-8 w-8 text-primary/50" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-5">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <div className="h-11 w-11 rounded-xl gradient-brand grid place-items-center shadow-glow mb-4">
                  <p.icon className="h-5 w-5 text-white" />
                </div>
                <div className="font-semibold mb-1">{p.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
