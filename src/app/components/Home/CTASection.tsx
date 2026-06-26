"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-brand-blue-dark to-secondary opacity-90" />
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 relative z-10 text-center space-y-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Ready to Start Your Roadmap?
        </h2>
        <p className="text-white/75 max-w-xl mx-auto text-base sm:text-lg">
          Join thousands of developers leveling up their careers today. Free to start, forever to master.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <Link href="/auth">
            <button className="bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 shadow-lg">
              Get Started Now
              <ArrowRight size={16} />
            </button>
          </Link>
          {/* Avatars */}
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="flex -space-x-2">
              {["A", "B", "C"].map((l, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-primary bg-white/20 flex items-center justify-center text-xs font-bold text-white"
                >
                  {l}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-primary bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                +9k
              </div>
            </div>
            <span>learners already enrolled</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
