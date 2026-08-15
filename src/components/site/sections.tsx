import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { InfoDialog } from "@/components/site/InfoDialog";
import {
  Lock,
  Smile,
  Users,
  Briefcase,
  Scale,
  MessageSquareWarning,
  Wand2,
  Clock,
  TrendingUp,
  Gauge,
  Eye,
  ShieldCheck,
  Fingerprint,
  BookOpen,
  Heart,
  PenLine,
  Brain,
  Sparkles,
  ArrowRight,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

/* ---------- Digital Footprint Timeline ---------- */
const TIMELINE = [
  { label: "Today", desc: "You publish the post." },
  { label: "Friends View", desc: "Your network reads it." },
  { label: "Shared Publicly", desc: "Reposts amplify reach." },
  { label: "Screenshots", desc: "Content escapes context." },
  { label: "Search Index", desc: "Search engines archive it." },
  { label: "Employer Search", desc: "Recruiters see it later." },
  { label: "Long-Term Footprint", desc: "Persists for years." },
];

export function TimelineSection() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1 text-xs mb-4">
            <Clock className="h-3.5 w-3.5" /> Digital Footprint Timeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            One post. <span className="gradient-text">Many futures.</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Where your content actually travels after you hit publish.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <div className="flex lg:flex-col items-center lg:items-center gap-4 lg:gap-3">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 rounded-full bg-primary grid place-items-center text-white font-bold shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                      {i + 1}
                    </div>
                  </div>
                  <div className="lg:text-center">
                    <div className="font-semibold text-sm">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Why This Matters ---------- */
function Counter({
  to,
  suffix = "",
  duration = 2,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);
  const fmt =
    to >= 1e9
      ? (n / 1e9).toFixed(2) + "B"
      : to >= 1e6
        ? (n / 1e6).toFixed(1) + "M"
        : Math.round(n).toLocaleString();
  return (
    <span ref={ref}>
      {fmt}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 4.95e9, suffix: "", label: "People use social media." },
  { value: 3.5e6, suffix: "+", label: "Posts shared every minute." },
  { value: 78, suffix: "%", label: "Recruiters check social profiles." },
];

const MATTERS = [
  { icon: Lock, title: "Privacy", desc: "Every share leaks a piece of who you are." },
  {
    icon: Fingerprint,
    title: "Digital Identity",
    desc: "You are the sum of your public footprint.",
  },
  { icon: ShieldCheck, title: "Reputation", desc: "One post can define you for years." },
  { icon: Heart, title: "Responsible Posting", desc: "Empathy scales — so does harm." },
  { icon: BookOpen, title: "Media Literacy", desc: "Understand context before it defines you." },
];

export function WhyMatters() {
  return (
    <section className="py-24 relative">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Why this <span className="gradient-text">matters</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Small decisions online create long-term consequences.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-3xl p-8 text-center"
            >
              <div className="text-5xl font-bold gradient-text mb-2">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MATTERS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-5 hover:shadow-glow transition-all"
            >
              <div className="h-11 w-11 rounded-xl gradient-brand grid place-items-center shadow-glow mb-4">
                <m.icon className="h-5 w-5 text-white" />
              </div>
              <div className="font-semibold mb-1">{m.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
const STEPS = [
  {
    n: "01",
    icon: PenLine,
    title: "Write Your Post",
    desc: "Paste or type any content — a tweet, a comment, a rant.",
  },
  {
    n: "02",
    icon: Brain,
    title: "AI Analysis",
    desc: "We analyze emotions, privacy, reputation, legal and audience perception.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Improve Before Posting",
    desc: "Get safer wording and personalized recommendations.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Three steps between "I want to post this" and "I know what will happen."
          </p>
        </div>

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
  );
}

/* ---------- Features ---------- */
const FEATURES = [
  {
    icon: Lock,
    title: "Privacy Detection",
    desc: "Detects emails, phone numbers and personal information.",
  },
  { icon: Smile, title: "Emotion Analysis", desc: "Identifies emotional tone and intensity." },
  {
    icon: Users,
    title: "Audience Simulator",
    desc: "Shows how different people may perceive your post.",
  },
  { icon: Briefcase, title: "Professional Reputation", desc: "Predicts career-related concerns." },
  { icon: Scale, title: "Legal Awareness", desc: "Highlights potentially risky statements." },
  {
    icon: MessageSquareWarning,
    title: "Misunderstanding Detector",
    desc: "Explains ambiguous wording.",
  },
  { icon: Wand2, title: "AI Rewrite", desc: "Suggests safer alternatives to risky phrases." },
  { icon: Clock, title: "Digital Footprint", desc: "Shows possible long-term visibility." },
  {
    icon: TrendingUp,
    title: "Reach Estimator",
    desc: "Estimates engagement potential per platform.",
  },
  { icon: Gauge, title: "Risk Dashboard", desc: "Displays all risks visually in one place." },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything you need to <span className="gradient-text">post smarter</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Ten specialized AI checks running on every draft.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass rounded-2xl p-5 hover:shadow-glow transition-all group relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full gradient-brand opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl glass grid place-items-center mb-4 group-hover:gradient-brand transition-all">
                  <f.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="font-semibold mb-1 text-sm">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
export function CTA() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl font-bold tracking-tight"
        >
          Ready to <span className="gradient-text">Think Before</span>
          <br /> You Post?
        </motion.h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Protect your reputation with AI-powered media literacy. Free during the hackathon preview.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 h-14 px-8 rounded-2xl gradient-brand text-white font-semibold shadow-glow hover:brightness-110 transition-all"
          >
            Start Free Demo{" "}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl glass-strong font-semibold hover:shadow-glow transition-all"
          >
            <Github className="h-5 w-5" /> View GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTab, setInfoTab] = useState<"about" | "privacy">("about");

  const openInfo = (tab: "about" | "privacy", e: React.MouseEvent) => {
    e.preventDefault();
    setInfoTab(tab);
    setInfoOpen(true);
  };

  return (
    <footer className="relative border-t border-glass-border py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-glow">
                <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-semibold">LUMINA.AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Attention economy visualizer and responsible posting assistant.
            </p>
          </div>

          <div>
            <div className="text-base font-semibold mb-4">Quick Links</div>
            <div className="flex gap-10 text-sm text-muted-foreground">
              {/* Column 1 */}
              <ul className="flex flex-col gap-2 flex-1">
                <li>
                  <Link to="/features" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>

                <li className="mt-auto pt-2">
                  <a href="#" onClick={(e) => openInfo("about", e)} className="hover:text-foreground transition">
                    About
                  </a>
                </li>
              </ul>
              {/* Column 2 */}
              <ul className="flex flex-col gap-2 flex-1">
                <li>
                  <a href="#" onClick={(e) => openInfo("privacy", e)} className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <Link to="/" hash="feedback" className="hover:text-foreground transition">
                    Feedback
                  </Link>
                </li>
                <li className="mt-auto pt-2">
                  <a
                    href="https://github.com"
                    className="hover:text-foreground transition inline-flex items-center gap-1"
                  >
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Project</div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs mb-3">
              <Eye className="h-3.5 w-3.5" /> Hackathon Project for UNESCO
            </div>
          </div>
        </div>
      </div>
      
      <InfoDialog isOpen={infoOpen} onOpenChange={setInfoOpen} type={infoTab} />
    </footer>
  );
}
