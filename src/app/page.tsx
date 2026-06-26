"use client";
import { useEffect } from "react";
import HeroSection from "./components/Home/HeroSection";
import EngineeredSection from "./components/Home/EngineeredSection";
import RoadmapSection from "./components/Home/RoadmapSection";
import FeaturesSection from "./components/Home/FeaturesSection";
import CTASection from "./components/Home/CTASection";
import Footer from "./components/Home/Footer";

const Home = () => {
  // Smooth-scroll to hash target on initial load (e.g. arriving via /#milestones)
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    // Small delay to let the page paint before scrolling
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="pt-16">
      <HeroSection />
      <EngineeredSection />
      <RoadmapSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Home;
