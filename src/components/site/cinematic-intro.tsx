import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageCircle, Heart, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0); // 0: Waiting, 1: Spotlight ON, 2: Spotlight OFF, 3: Savior, 4: Done
  const [showSkip, setShowSkip] = useState(true);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        handleIlluminate();
      }, 5000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleIlluminate = () => {
    setStep(1); // Spotlight clicks ON instantly

    // After 4 seconds, spotlight clicks OFF
    setTimeout(() => {
      setStep(2);
    }, 4000);

    // 1.5 seconds of darkness, then Savior appears
    setTimeout(() => {
      setStep(3);
    }, 5500);

    // 4 seconds of savior, then smoothly fade out
    setTimeout(() => {
      setStep(4);
      setTimeout(onComplete, 2500);
    }, 9500);
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: step === 4 ? 0 : 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white overflow-hidden"
      style={{ pointerEvents: step === 4 ? 'none' : 'auto' }}
    >
      {/* Skip Button */}
      {showSkip && (
        <button 
          onClick={() => { setStep(4); onComplete(); }}
          className="absolute top-8 right-8 z-50 text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          Skip Intro
        </button>
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 0: Pitch Black, waiting for interaction */}
        {step === 0 && (
          <motion.div key="wait" className="flex flex-col items-center" exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <button
              onClick={handleIlluminate}
              className="text-white/40 hover:text-white text-sm uppercase tracking-[0.4em] font-semibold transition-colors duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] px-8 py-3 rounded-none border border-white/10 hover:border-white/50"
            >
              [ Illuminate ]
            </button>
          </motion.div>
        )}

        {/* STEP 1: Interrogation Spotlight ON */}
        {step === 1 && (
          <motion.div key="spotlight" className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            {/* The Spotlight Cone (CSS overlay) */}
            <div className="absolute inset-0 bg-black" />
            <div 
              className="absolute inset-0 opacity-80"
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 25%, rgba(0,0,0,1) 60%)"
              }}
            />
            
            <motion.div
              initial={{ scale: 0.9, filter: "brightness(0)" }}
              animate={{ scale: 1, filter: "brightness(1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* The Terrible Post */}
              <div className="bg-white text-black w-full max-w-md p-6 rounded-none shadow-[0_0_100px_rgba(255,255,255,0.1)] border-2 border-black/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-black/10 rounded-full" />
                  <div>
                    <div className="font-bold text-sm">You</div>
                    <div className="text-black/50 text-xs">@your_username • Just now</div>
                  </div>
                </div>
                <p className="text-lg font-medium leading-snug">
                  My manager is completely useless and has no idea what they're doing. This company is a total joke.
                </p>
                <div className="flex items-center gap-6 mt-6 text-black/40">
                  <MessageCircle className="h-5 w-5" />
                  <Repeat2 className="h-5 w-5" />
                  <Heart className="h-5 w-5" />
                </div>
              </div>

              {/* Dramatic Copy */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-12 text-center"
              >
                <h2 className="text-2xl font-light tracking-widest text-white/80 uppercase">
                  Once it's out there...
                </h2>
                <h2 className="text-2xl font-bold tracking-widest text-white uppercase mt-2">
                  It's out there.
                </h2>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 2: Spotlight OFF (Total Darkness) */}
        {step === 2 && (
          <motion.div key="darkness" className="absolute inset-0 bg-black" />
        )}

        {/* STEP 3: The Savior */}
        {step === 3 && (
          <motion.div key="savior" className="absolute inset-0 flex items-center justify-center bg-black">
            <motion.div
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="h-20 w-20 bg-primary shadow-[0_0_80px_rgba(var(--color-primary),1)] grid place-items-center mb-8 rotate-45">
                <Sparkles className="h-8 w-8 text-primary-foreground -rotate-45" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-thin tracking-[0.2em] text-white/90 uppercase text-center">
                Unless...
              </h1>
              <p className="mt-6 text-xl text-white/50 font-light tracking-widest uppercase">
                You see it first.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
