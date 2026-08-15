import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, MessageSquare } from "lucide-react";
import { apiFeedback } from "@/lib/api";

export function FeedbackSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) return;
    setStatus("sending");
    try {
      await apiFeedback(name, email, message);
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="feedback" className="py-12 sm:py-16 relative">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full text-center mb-6"
        >
          <h2 className="text-2xl font-bold tracking-tight text-center">
            <span className="gradient-text">Feedback</span>
          </h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-5 sm:p-6 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fb-name"
                className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
              >
                Name
              </label>
              <input
                id="fb-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-11 rounded-xl bg-background/40 border border-glass-border px-4 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="fb-email"
                className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
              >
                Email
              </label>
              <input
                id="fb-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 rounded-xl bg-background/40 border border-glass-border px-4 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="fb-message"
              className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
            >
              Message
            </label>
            <textarea
              id="fb-message"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you think about LUMINA.AI? Any features you'd love to see?"
              className="w-full resize-none rounded-xl bg-background/40 border border-glass-border p-4 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {message.length}/2000
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "sending" || status === "sent" || message.length < 10}
            className="w-full h-12 rounded-xl gradient-brand text-white font-semibold shadow-glow hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
          >
            {status === "sending" && (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            )}
            {status === "sent" && (
              <>
                <CheckCircle2 className="h-4 w-4" /> Thank you!
              </>
            )}
            {status === "error" && "Something went wrong. Try again."}
            {status === "idle" && (
              <>
                <Send className="h-4 w-4" /> Send Feedback
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
