"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex items-center pt-16 pb-20 overflow-hidden bg-background">
      {/* Subtle background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div className="space-y-8">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/8">
                The Future of Tech Education
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground">
                Master Your Tech Journey with{" "}
                <span className="text-primary">Structured Roadmaps</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg mt-4">
                Our unique Learn-Validate-Build-Progress philosophy ensures you
                don&apos;t just consume tutorials — you master skills through
                structured paths and real-world application.
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/auth">
                <button className="btn-primary text-base px-6 py-3 rounded-xl w-full sm:w-auto">
                  Start Learning for Free
                  <ArrowRight size={16} />
                </button>
              </Link>
              <button className="btn-secondary text-base px-6 py-3 rounded-xl flex items-center gap-2 justify-center">
                <Play size={15} className="text-primary" />
                How it works
              </button>
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-4 gap-6 pt-4 border-t border-border"
            >
              {[
                { value: "10,000+", label: "Active Learners" },
                { value: "50+", label: "Expert Roadmaps" },
                { value: "4.9/5", label: "User Satisfaction" },
                { value: "250k+", label: "Lessons Completed" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: laptop image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/laptop-hero.jpeg"
                  alt="DevMap dashboard shown on a laptop screen"
                  width={1024}
                  height={1024}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating achievement toast */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 -left-6 flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 shadow-xl"
              >
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Milestone Achieved!</p>
                  <p className="text-[10px] text-muted-foreground">HTML &amp; CSS Fundamentals</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
