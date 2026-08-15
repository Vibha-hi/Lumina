import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Chrome,
  MousePointerClick,
  ClipboardCheck,
  Wand2,
  PenLine,
  Smile,
  Lock,
  Scale,
  MessageSquareWarning,
  TrendingUp,
  Copy,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/extension")({
  head: () => ({
    meta: [
      { title: "Chrome Extension — LUMINA.AI" },
      {
        name: "description",
        content:
          "Add LUMINA.AI to Chrome. Analyze any page, selection, or clipboard content in one click.",
      },
      { property: "og:title", content: "LUMINA.AI Chrome Extension" },
      {
        property: "og:description",
        content: "Responsible posting, one click away — right inside your browser.",
      },
    ],
  }),
  component: ExtensionPage,
});

const POPUP_ACTIONS = [
  { icon: MousePointerClick, label: "Analyze Current Page" },
  { icon: PenLine, label: "Analyze Selected Text" },
  { icon: ClipboardCheck, label: "Analyze Clipboard" },
  { icon: Wand2, label: "Quick Rewrite" },
  { icon: PenLine, label: "Quick Grammar" },
  { icon: Smile, label: "Emotion Meter" },
  { icon: Lock, label: "Privacy Risk" },
  { icon: Scale, label: "Legal Risk" },
  { icon: MessageSquareWarning, label: "Manipulation Score" },
  { icon: TrendingUp, label: "Potential Reach" },
  { icon: Copy, label: "Copy Result" },
  { icon: LayoutDashboard, label: "Open Dashboard" },
];

const PERMISSIONS = [
  { name: "activeTab", why: "Read the tab you explicitly click on — never background browsing." },
  {
    name: "storage",
    why: "Save your preferences (dark mode, default tone) locally in your browser.",
  },
  { name: "scripting", why: "Highlight risky text on the page after you request analysis." },
  { name: "tabs", why: "Open the LUMINA.AI dashboard in a new tab when you ask." },
  { name: "contextMenus", why: "Add a right-click menu to analyze selected text." },
  { name: "clipboardRead", why: "Read clipboard content — only when you tap 'Analyze Clipboard'." },
  { name: "clipboardWrite", why: "Copy AI rewrite suggestions to your clipboard on request." },
  { name: "host_permissions", why: "Send text you analyze to the LUMINA.AI API over HTTPS." },
];

const HOW_TO_USE = [
  {
    step: "1",
    title: "Install the Extension",
    desc: (
      <>
        <p>Install the official <strong className="text-foreground">LUMINA.AI browser extension</strong> from your browser's extension store.</p>
        <p>Once installed, the LUMINA.AI icon will appear in your browser's extensions area.</p>
        <p>For easier access, you can pin the extension to your browser toolbar.</p>
      </>
    ),
  },
  {
    step: "2",
    title: "Sign In",
    desc: (
      <>
        <p>Click the <strong className="text-foreground">LUMINA.AI</strong> extension icon.</p>
        <p>If you already have a LUMINA.AI account:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Select <strong className="text-foreground">Sign In</strong>.</li>
          <li>Enter your account credentials.</li>
          <li>Complete authentication if requested.</li>
        </ol>
        <p>Once you're signed in, the extension is ready to use.</p>
      </>
    ),
  },
  {
    step: "3",
    title: "Select Text",
    desc: (
      <>
        <p>When you're on a webpage, select the text you want LUMINA.AI to analyze.</p>
        <p>You can select multiple paragraphs or a complete response or a draft.</p>
        <p>The extension works seamlessly on platforms like <strong>Instagram, X, Reddit, and LinkedIn</strong>.</p>
        <p>You don't need to copy the text manually.</p>
      </>
    ),
  },
  {
    step: "4",
    title: "Analyze & Review",
    desc: (
      <ul className="list-disc pl-5 space-y-2">
        <li>After selecting your text, the LUMINA.AI icon will appear next to the selected content.</li>
        <li>Click the icon to open the quick analysis options and view your Risk Score instantly.</li>
        <li>To get a more detailed breakdown, click on the Risk Score itself.</li>
        <li>This will expand the full analysis directly in the extension, allowing you to review insights without needing to navigate back to the dashboard.</li>
        <li>Click on the cross on top right to exit.</li>
      </ul>
    ),
  },
];

function ExtensionPage() {
  return (
    <PageShell
      eyebrow="Chrome Extension · Manifest V3"
      title={
        <>
          LUMINA.AI, <span className="gradient-text">right in your browser.</span>
        </>
      }
      subtitle="Analyze any post, article, or selection without leaving the page you're on."
    >
      <section className="pb-14 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-start">
          {/* Popup mock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-6 shadow-glow-purple mx-auto w-full max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-glow">
                  <Chrome className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">LUMINA.AI</div>
                  <div className="text-sm font-semibold">Browser Popup</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {POPUP_ACTIONS.map((a) => (
                <div
                  key={a.label}
                  className="glass rounded-xl p-3 text-xs flex items-center gap-2 hover:shadow-glow transition"
                >
                  <a.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{a.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => toast.info("The LUMINA.AI extension is pending Web Store approval. We'll notify you when it's live!")}
              className="mt-4 w-full h-11 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:brightness-110 transition-all"
            >
              Add to Chrome
            </button>
          </motion.div>

          {/* Permissions */}
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs mb-4">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> Permissions & Privacy
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Every permission, <span className="gradient-text">explained.</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              LUMINA.AI only asks for what it needs. No background tracking, no browsing history, no
              ad profiles.
            </p>
            <div className="space-y-2">
              {PERMISSIONS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl p-3 flex items-start gap-3"
                >
                  <code className="text-xs bg-primary/10 text-primary rounded-md px-2 py-1 font-mono shrink-0">
                    {p.name}
                  </code>
                  <span className="text-xs text-muted-foreground leading-relaxed">{p.why}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 relative border-y border-glass-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">How to Use the LUMINA.AI Extension</h2>
            <p className="text-lg text-foreground font-semibold mt-2">Your writing assistant, wherever you write.</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
              The LUMINA.AI browser extension lets you access your writing analysis tools without leaving the webpage you're working on.
              Whether you're writing an email, filling out an application, working on an essay, or drafting content online, you can use LUMINA.AI directly from your browser.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {HOW_TO_USE.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative glass rounded-3xl p-8 hover:shadow-glow transition-all"
              >
                <div className="text-5xl font-bold gradient-text opacity-40 mb-4">0{s.step}</div>
                <div className="text-lg font-semibold mb-2">{s.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="glass-strong rounded-3xl p-8 text-center">
            <div className="h-14 w-14 rounded-2xl gradient-brand grid place-items-center shadow-glow mx-auto mb-4">
              <Chrome className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Data collection at a glance</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
              We collect only what LUMINA.AI needs to work. Everything else stays with you.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6 text-left">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-success mb-2">Collected</div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Email and name (account)</li>
                  <li>Text you explicitly submit for analysis</li>
                  <li>Basic technical logs and extension settings</li>
                </ul>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-danger mb-2">
                  Never collected
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Passwords or credentials</li>
                  <li>Browsing history</li>
                  <li>Private messages, location, camera, microphone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
