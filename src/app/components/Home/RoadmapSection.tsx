"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";

const RoadmapSection = () => {
  return (
    <section id="milestones" className="py-24 bg-background relative scroll-mt-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: heading + copy + step list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Your Journey, Visualized.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-md">
              See exactly where you are and what&apos;s next. Our Frontend Development
              path covers everything from semantic markup to advanced state management.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { label: "Milestone 1: HTML Semantic Foundations", done: true },
                { label: "Current: CSS Grid & Flexbox Mastery", active: true },
                { label: "Milestone 3: JavaScript ES6+ & Async", locked: true },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    m.active
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : m.done
                      ? "bg-muted text-foreground border border-border"
                      : "bg-muted/40 text-muted-foreground border border-dashed border-border"
                  }`}
                >
                  <span className="shrink-0">
                    {m.done ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : m.active ? (
                      <Circle size={16} className="fill-white text-white" />
                    ) : (
                      <Lock size={14} />
                    )}
                  </span>
                  {m.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: milestone tracker card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="devmap-card relative"
          >
            <div className="space-y-5 relative">
              {/* vertical connector line */}
              <div className="absolute left-[19px] top-5 bottom-5 w-px bg-border" />

              {[
                { tag: "HTML", label: "HTML Foundations", sub: "Completed 2 days ago", done: true },
                { tag: "CSS", label: "Modern CSS Layouts", sub: "65% Progress", active: true },
                { tag: "JS", label: "Logic & DOM", sub: "Locked Milestone", locked: true },
              ].map((m) => (
                <div key={m.label} className="relative flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 z-10 ${
                    m.done ? "bg-green-500" : m.active ? "bg-primary ring-4 ring-primary/15" : "bg-muted text-muted-foreground"
                  }`}>
                    {m.tag}
                  </div>
                  <div className={`flex-1 rounded-xl p-3 ${m.active ? "border border-primary bg-primary/5" : "bg-muted/40"} ${m.locked ? "opacity-60" : ""}`}>
                    <p className={`font-semibold text-sm ${m.active ? "text-primary" : "text-foreground"}`}>
                      {m.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
                    {m.active && (
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[65%]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
