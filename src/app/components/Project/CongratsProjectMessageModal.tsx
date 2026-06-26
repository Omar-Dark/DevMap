"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const CongratsProjectMessageModal = () => {
  return (
    <div className="text-center space-y-5 py-2">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
        <Sparkles size={28} className="text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground">🎉 Project Complete!</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
          You&apos;ve completed all steps of this project! Great job putting your skills into practice.
        </p>
      </div>
      <Link
        href="/project"
        className="btn-primary inline-flex px-6 py-2.5 rounded-xl text-sm justify-center"
      >
        Start a New Project 🚀
      </Link>
    </div>
  );
};

export default CongratsProjectMessageModal;
