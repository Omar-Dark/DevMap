"use client";
import { motion } from "framer-motion";
import { LayoutGrid, ShieldCheck, Trophy } from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Structured Learning",
    desc: "Expert-curated roadmaps that guide you from beginner to professional, step-by-step without the noise.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Verified Skills",
    desc: "Interactive quizzes and hands-on projects that validate your knowledge at every milestone of your path.",
    color: "bg-muted text-muted-foreground",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    desc: "Earn professional badges and track your streaks as you build a portfolio-ready profile for future employers.",
    color: "bg-warning/10 text-warning",
  },
];

const EngineeredSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Engineered for Mastery
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            We&apos;ve broken down complex technologies into digestible, verified
            milestones that keep you moving forward.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="devmap-card text-left hover:border-primary/30 hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EngineeredSection;
