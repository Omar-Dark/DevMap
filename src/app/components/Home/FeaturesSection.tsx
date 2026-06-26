"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const FeaturesSection = () => {
  return (
    <section id="ai-assistant" className="py-24 bg-foreground text-background relative overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
          >
            {/* Chat header */}
            <div className="px-4 py-3 bg-slate-700/50 border-b border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                DM
              </div>
              <div>
                <p className="text-sm font-semibold text-white">DevMap Assistant</p>
                <p className="text-xs text-slate-400">● Online & Ready</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-4 space-y-4">
              <div className="bg-slate-700/50 rounded-xl rounded-tl-sm px-4 py-3 max-w-xs">
                <p className="text-sm text-slate-200">How can I help you with your React Milestone today?</p>
              </div>
              <div className="ml-auto bg-primary rounded-xl rounded-tr-sm px-4 py-3 max-w-xs">
                <p className="text-sm text-white">I&apos;m stuck on useEffect cleanup functions. Why do we need them?</p>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 shrink-0">
                  <span className="text-primary text-xs">●●●</span>
                </div>
                <div className="bg-slate-700/50 rounded-xl rounded-tl-sm px-4 py-3 flex-1">
                  <p className="text-sm text-slate-200">Great question! Cleanup functions prevent memory leaks by stopping subscriptions or timers when a component unmounts...</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border border-slate-700 rounded-xl px-3 py-2">
                <input
                  readOnly
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-600"
                />
                <button className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs">▶</button>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-xs font-bold tracking-widest text-primary uppercase">✨ AI-Powered Learning</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Never Get Stuck Again.</h2>
            <p className="text-slate-400">
              Our context-aware AI Assistant lives inside your roadmaps. It understands exactly what you&apos;re learning and provides tailored hints, code explanations, and debugging help 24/7.
            </p>
            <ul className="space-y-3">
              {[
                "Personalized code reviews & explanations",
                "Context-aware debugging for your projects",
                "Simplified breakdowns of complex concepts",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
