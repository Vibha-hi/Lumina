import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { DemoSection } from "@/components/site/demo";
import { FeedbackSection } from "@/components/site/feedback-form";
import { CinematicIntro } from "@/components/site/cinematic-intro";
import {
  TimelineSection,
  WhyMatters,
  HowItWorks,
  FeaturesGrid,
  CTA,
  Footer,
} from "@/components/site/sections";


export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Show intro ONLY on a true hard reload AND only if not yet seen / not logged in.
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;

    // 1. If user has logged in once (has a token), never show intro again
    if (localStorage.getItem("lumina_token")) {
      return false;
    }

    // 2. If already seen THIS SESSION (tab), don't show it again until they close and reopen the website
    if (sessionStorage.getItem("lumina_intro_seen")) {
      return false;
    }

    // 3. Show on an actual browser reload OR when opening the website (navigate)
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const navType = navEntries.length > 0 ? navEntries[0].type : "navigate"; // Default to navigate if not found
    const isValidNav = navType === "reload" || navType === "navigate";
    return isValidNav;
  });

  const handleIntroComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lumina_intro_seen", "1");
    }
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      <div className="min-h-screen text-foreground overflow-x-hidden">
          <Navbar />
          <main>
            <Hero />
            <DemoSection />
            <TimelineSection />
            <WhyMatters />
            <HowItWorks />
            <FeaturesGrid />
            <CTA />
            <FeedbackSection />
          </main>
          <Footer />
      </div>
    </>
  );
}
