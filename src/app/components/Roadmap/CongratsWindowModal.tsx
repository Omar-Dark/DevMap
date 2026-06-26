"use client";
import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import Link from "next/link";
import { userProgressProps } from "@/app/types/api";
import { quizProps } from "@/app/types/roadmap";

const CongratsWindowModule = ({
  userProgress,
  matchedQuiz,
}: {
  userProgress: userProgressProps;
  matchedQuiz?: quizProps | null;
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
      >
        <Trophy size={36} className="text-primary" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">
          🎉 Congratulations!
        </h3>
        <p className="font-semibold text-foreground">
          You finished {userProgress?.roadmap.title ?? "this roadmap"}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
          {matchedQuiz
            ? "You've completed all sections. Ready to put your knowledge to the test?"
            : "You've successfully completed all sections. Keep learning and challenge yourself with the next level."}
        </p>
      </div>

      <div className="flex gap-3 pt-2 w-full">
        {matchedQuiz ? (
          <Link
            href={{
              pathname: `/quiz/${matchedQuiz._id}`,
              query: { quizTitle: matchedQuiz.title, quizDescription: matchedQuiz.description },
            }}
            className="btn-primary flex-1 py-2.5 rounded-xl justify-center text-sm"
          >
            <Sparkles size={14} />
            Take Quiz
          </Link>
        ) : (
          <Link href="/roadmap" className="btn-primary flex-1 py-2.5 rounded-xl justify-center text-sm">
            Continue Learning
          </Link>
        )}
      </div>
    </div>
  );
};

export default CongratsWindowModule;
