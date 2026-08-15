import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./sections";

export function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <section className="relative pt-32 pb-14 overflow-hidden">

          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-float" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs mb-5"
              >
                <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                {eyebrow}
              </motion.div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
}
