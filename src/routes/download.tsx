import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Apple,
  Monitor,
  Smartphone,
  Chrome,
  Download as DownloadIcon,
  Terminal,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download LUMINA.AI" },
      {
        name: "description",
        content:
          "Download LUMINA.AI for Windows, Mac, Linux, Android, or add the Chrome Extension.",
      },
      { property: "og:title", content: "Download LUMINA.AI" },
      {
        property: "og:description",
        content: "Available on every major platform. Free during the preview.",
      },
    ],
  }),
  component: DownloadPage,
});

const PLATFORMS = [
  {
    icon: Monitor,
    name: "Windows",
    version: "v1.0.0",
    size: "84 MB",
    note: "Windows 10 & 11 · 64-bit",
  },
  { icon: Apple, name: "macOS", version: "v1.0.0", size: "92 MB", note: "Apple Silicon & Intel" },
  {
    icon: Terminal,
    name: "Linux",
    version: "v1.0.0",
    size: "78 MB",
    note: ".deb · .rpm · AppImage",
  },
  { icon: Smartphone, name: "Android APK", version: "v1.0.0", size: "42 MB", note: "Android 10+" },
];

const CHANGELOG = [
  {
    v: "v1.0.0",
    date: "Preview",
    notes: [
      "Initial LUMINA.AI release",
      "Emotion, privacy, legal, and reach analysis",
      "AI Rewrite with 4 tone presets",
      "Chrome Extension MV3",
    ],
  },
  {
    v: "v0.9.0",
    date: "Beta",
    notes: [
      "Bias & manipulation detection",
      "Grammar + readability scoring",
      "Improved dashboard performance",
    ],
  },
  {
    v: "v0.8.0",
    date: "Alpha",
    notes: ["First public demo", "Audience simulation", "Digital footprint timeline"],
  },
];

function DownloadPage() {
  return (
    <PageShell
      eyebrow="Available on every platform"
      title={
        <>
          Download <span className="gradient-text">LUMINA.AI</span>
        </>
      }
      subtitle="Free during the preview. No credit card required."
    >
      <section className="pb-12 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="glass-strong rounded-2xl p-6 hover:shadow-glow transition-all flex flex-col"
              >
                <div className="h-12 w-12 rounded-xl gradient-brand grid place-items-center shadow-glow mb-4">
                  <p.icon className="h-6 w-6 text-white" />
                </div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.note}</div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {p.version} · {p.size}
                </div>
                <button className="mt-5 inline-flex items-center justify-center gap-2 h-11 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:brightness-110 transition-all">
                  <DownloadIcon className="h-4 w-4" /> Download
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-brand grid place-items-center shadow-glow">
                <Chrome className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold">Chrome Extension</div>
                <div className="text-xs text-muted-foreground">
                  Analyze any post directly in your browser.
                </div>
              </div>
            </div>
            <Link
              to="/extension"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl glass-strong text-sm font-medium hover:shadow-glow transition-all"
            >
              View Extension <Chrome className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Version <span className="gradient-text">history</span>
          </h2>
          <div className="space-y-4">
            {CHANGELOG.map((c, i) => (
              <motion.div
                key={c.v}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div className="font-semibold gradient-text">{c.v}</div>
                  <div className="text-xs text-muted-foreground">{c.date}</div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {c.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
