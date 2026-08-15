import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import { Sparkles, ShieldCheck, Brain, Eye, ArrowRight, Download, Chrome } from "lucide-react";
import { Link } from "@tanstack/react-router";

const BADGES = [
  { icon: ShieldCheck, label: "Privacy Aware" },
  { icon: Brain, label: "AI Powered" },
  { icon: Eye, label: "Media Literacy" },
  { icon: Sparkles, label: "Digital Safety" },
];

function CircularScore({ value = 72 }: { value?: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const offset = useTransform(spring, (v) => c - (v / 100) * c);
  useEffect(() => { mv.set(value); }, [mv, value]);

  return (
    <div className="relative h-44 w-44">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} className="stroke-white/10" strokeWidth="12" fill="none" />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.66 0.19 255)" />
            <stop offset="100%" stopColor="oklch(0.63 0.22 295)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="80" cy="80" r={r}
          stroke="url(#scoreGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-4xl font-bold gradient-text">{value}%</motion.div>
          <div className="text-xs text-muted-foreground mt-1">Overall Risk</div>
        </div>
      </div>
    </div>
  );
}

const MINI = [
  { label: "Privacy", val: 65, color: "bg-warning" },
  { label: "Professional", val: 82, color: "bg-danger" },
  { label: "Misunderstanding", val: 54, color: "bg-warning" },
  { label: "Legal", val: 18, color: "bg-success" },
  { label: "Virality", val: 71, color: "bg-accent-purple" },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Text scaling: starts at 1, scales moderately to prevent glitching
  const textScale = useTransform(scrollYProgress, [0, 0.4, 0.9], [1, 1.2, 10]);
  
  // Opacity: fades out slightly earlier to prevent blocking the view
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Cinematic Intro Sequence */}
      <section ref={containerRef} className="relative h-[150vh]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <motion.div 
            style={{ 
              scale: textScale, 
              opacity: textOpacity,
              willChange: "transform, opacity"
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* The Video Text Mask */}
            <h1 
              className="text-[20vw] font-black tracking-tighter uppercase animate-gradient"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                transformOrigin: 'center center',
                willChange: 'background-position',
                transform: 'translateZ(0)'
              }}
            >
              LUMINA
            </h1>
          </motion.div>
          
          {/* Subtle scroll indicator */}
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-sm flex flex-col items-center gap-2"
          >
            <span>Scroll to Enter</span>
            <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Main Hero Content */}
      <section className="relative z-30 min-h-screen pb-32 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl px-4 flex flex-col items-center text-center w-full"
        >
           <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs mb-8 shadow-sm bg-white/5 backdrop-blur-xl border border-white/10">
             <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
             <span className="text-white/80 font-medium">LUMINA.AI · Attention Economy Visualizer</span>
           </div>

           <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-[1.05] text-white">
             Understand Content
             <br />
             Before It <span className="text-primary">Understands You.</span>
           </h2>

           <p className="mt-8 text-xl text-white/60 max-w-2xl font-light leading-relaxed mx-auto">
             LUMINA.AI reveals the psychological, legal, and reputational impact of what you post — before you publish.
           </p>

           <div className="mt-12 flex flex-wrap justify-center gap-4">
             <Link to="/extension" className="group inline-flex items-center gap-2 h-14 px-8 rounded-full bg-white text-black font-medium hover:scale-105 transition-all shadow-xl">
               <Chrome className="h-4 w-4" /> Add Extension
             </Link>
             <Link to="/dashboard" className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-white/5 backdrop-blur-md text-white font-medium border border-white/20 hover:bg-white/10 transition-all shadow-sm">
               Try It Now <ArrowRight className="h-4 w-4" />
             </Link>
           </div>

           {/* Dashboard mockup centerpiece */}
           <div className="relative mt-24 w-full max-w-4xl mx-auto">
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none rounded-3xl" />
             <div className="rounded-3xl p-8 shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/10 bg-white/5 backdrop-blur-2xl relative z-0">
               <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                 <div className="text-left">
                   <div className="text-sm text-white/50 font-medium">Analysis Preview</div>
                   <div className="text-lg font-semibold text-white">Risk Overview</div>
                 </div>
                 <div className="flex gap-2">
                   <span className="h-3 w-3 rounded-full bg-danger/60" />
                   <span className="h-3 w-3 rounded-full bg-warning/60" />
                   <span className="h-3 w-3 rounded-full bg-success/60" />
                 </div>
               </div>

               <div className="flex flex-col md:flex-row items-center gap-12">
                 <CircularScore value={72} />
                 <div className="flex-1 w-full space-y-4">
                   {MINI.map((m, i) => (
                     <motion.div key={m.label} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                       <div className="flex justify-between text-sm mb-1.5 font-medium">
                         <span className="text-white/60">{m.label}</span>
                         <span className="text-white">{m.val}%</span>
                       </div>
                       <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                         <motion.div className={`h-full ${m.color}`}
                           initial={{ width: 0 }} whileInView={{ width: `${m.val}%` }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1, duration: 1, ease: "easeOut" }} />
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
        </motion.div>
      </section>
    </div>
  );
}
