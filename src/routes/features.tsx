import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Smile,
  Lock,
  PenLine,
  Scale,
  Eye,
  Wand2,
  TrendingUp,
  Fingerprint,
  ShieldCheck,
  MessageSquareWarning,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — LUMINA.AI" },
      {
        name: "description",
        content:
          "Emotion detection, privacy risk, legal analysis, AI rewrite, and reach prediction — all in one responsible posting assistant.",
      },
      { property: "og:title", content: "Features — LUMINA.AI" },
      {
        property: "og:description",
        content: "Nine AI-powered checks that run on every draft before you publish.",
      },
    ],
  }),
  component: FeaturesPage,
});

const FEATURES = [
  {
    icon: Smile,
    title: "Emotion Detection",
    desc: "Understand the emotional signature of your text — anger, fear, joy, curiosity, and more.",
  },
  {
    icon: Lock,
    title: "Privacy Risk",
    desc: "Detects emails, phone numbers, addresses, IDs, and other exposed personal data.",
  },
  {
    icon: PenLine,
    title: "Grammar Checking",
    desc: "Grammar, spelling, punctuation, tone, and professionalism — with inline suggestions.",
  },
  {
    icon: Scale,
    title: "Legal Risk",
    desc: "Flags defamation, harassment, hate speech, false claims, and copyright concerns.",
  },
  {
    icon: Eye,
    title: "Attention Analysis",
    desc: "Measures how a post competes for attention in a saturated feed.",
  },
  {
    icon: TrendingUp,
    title: "Future Reach Prediction",
    desc: "Estimates virality, shareability, controversy score, and platform-specific reach.",
  },
  {
    icon: Wand2,
    title: "AI Rewrite",
    desc: "Generates safer, professional, neutral, and friendly alternatives — while preserving intent.",
  },
  {
    icon: BookOpen,
    title: "Readability Score",
    desc: "Measures how easily different audiences will understand your writing.",
  },
  {
    icon: Sparkles,
    title: "AI Explanation",
    desc: "Explains every warning in plain language so you learn as you post.",
  },
];

function FeaturesPage() {
  return (
    <PageShell
      eyebrow="Everything LUMINA.AI checks"
      title={
        <>
          Post with <span className="gradient-text">confidence.</span>
        </>
      }
      subtitle="Nine specialized AI checks run on every draft — so you understand consequences before your audience does."
    >
      <section className="pb-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 hover:shadow-glow transition-all group relative overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full gradient-brand opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" />
                <div className="h-12 w-12 rounded-xl glass grid place-items-center mb-4 group-hover:gradient-brand transition-all">
                  <f.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="font-semibold mb-1.5">{f.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
