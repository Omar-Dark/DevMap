"use client";

import { quizResultsProps } from "@/app/types/api";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ClipboardList,
  Loader2,
  FileJson,
  FileText,
  File,
  ArrowRight,
  Award,
  Flame,
} from "lucide-react";
import { exportHelper, findBestTitleMatch } from "@/app/helper";
import { useRouter } from "next/navigation";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { projectDummyDataProps } from "@/app/types/roadmap";
import Link from "next/link";

const QuizResults = ({
  percentage,
  grade,
  correctAnswers,
  wrongAnswers,
  totalQuestions,
  status,
  answerDetails,
  quizTitle,
  quizId,
  roadmapId,
  minPassPct = 50,
}: quizResultsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [matchedProject, setMatchedProject] = useState<projectDummyDataProps | null>(null);
  const safePercentage = Math.min(100, Math.max(0, percentage || 0));
  // Respect the minPassPct threshold — fallback to status from API if no threshold
  const isPassed = roadmapId ? safePercentage >= minPassPct : (status === "Passed");
  const isPerfect = safePercentage === 100;

  // Best-effort title match to a project — there's no real quiz<->project
  // relationship in the API, so this offers the closest-named project.
  useEffect(() => {
    if (!isPassed || !quizTitle) return;
    const fetchProjects = async () => {
      try {
        const res = await RoadmapApiAxiosInstance.get(
          apiRoutes.Project.getAllProjects.route({ page: 1, limit: 50 })
        );
        if (res.data.success) {
          const match = findBestTitleMatch(quizTitle, res.data.projects as projectDummyDataProps[]);
          setMatchedProject(match);
        }
      } catch {
        // Non-critical
      }
    };
    fetchProjects();
  }, [isPassed, quizTitle]);

  const restartQuiz = async () => {
    try {
      setLoading(true);
      if (!quizId) return;
      localStorage.removeItem("questions");
      await RoadmapApiAxiosInstance.get(apiRoutes.Question.restartQuizAnswers.route(quizId));
      router.push(`/quiz/${quizId}`);
    } catch {
      toast.error("Failed to restart the quiz. Please try again");
    } finally { setLoading(false); }
  };

  const goToQuiz = () => { localStorage.removeItem("questions"); router.push("/quiz"); };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-2xl p-6 sm:p-8 border-2 overflow-hidden ${
                isPerfect
                  ? "border-yellow-500 bg-gradient-to-br from-yellow-500 to-orange-500"
                  : isPassed ? "border-green-500 bg-green-500" : "bg-primary border-primary"
              }`}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                  {isPerfect && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full mb-3">
                      🏆 Perfect Score!
                    </span>
                  )}
                  {isPassed && !isPerfect && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full mb-3">
                      ✅ Quiz Completed
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{quizTitle}</h1>
                  {isPerfect && (
                    <p className="text-white/90 text-sm mt-2 font-medium">Outstanding! You answered every single question correctly! 🎉</p>
                  )}
                  {isPassed && !isPerfect && (
                    <p className="text-white/80 text-sm mt-2">
                      {roadmapId ? `You passed with ${safePercentage}% — project unlocked!` : "You've successfully completed this quiz."}
                    </p>
                  )}
                  {!isPassed && (
                    <p className="text-white/80 text-sm mt-2">
                      You scored {safePercentage}%.{roadmapId ? ` You need at least ${minPassPct}% to unlock the project.` : " Keep practicing!"}
                    </p>
                  )}
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center shrink-0">
                  <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Final Score</p>
                  <p className="text-4xl font-bold text-white">{safePercentage}<span className="text-xl">/100</span></p>
                  <span className={`mt-1 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                    isPerfect ? "bg-yellow-300 text-yellow-900"
                    : isPassed ? "bg-green-400 text-green-900"
                    : "bg-red-400 text-red-900"
                  }`}>
                    {isPerfect ? "PERFECT" : isPassed ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Questions", value: totalQuestions, color: "text-foreground" },
                { label: "Correct", value: correctAnswers, color: "text-green-500" },
                { label: "Incorrect", value: wrongAnswers, color: "text-destructive" },
              ].map((s) => (
                <div key={s.label} className="devmap-card text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isPassed && matchedProject ? (
                <Link
                  href={`/project/${matchedProject._id}`}
                  className="btn-primary flex-1 py-3 rounded-xl justify-center gap-2"
                >
                  Proceed to Project <ArrowRight size={16} />
                </Link>
              ) : isPassed && roadmapId ? (
                <Link
                  href={`/roadmap/${roadmapId}`}
                  className="btn-primary flex-1 py-3 rounded-xl justify-center gap-2"
                >
                  <ArrowRight size={16} /> Back to Roadmap
                </Link>
              ) : !isPassed ? (
                <button
                  onClick={restartQuiz}
                  disabled={loading}
                  className="btn-secondary flex-1 py-3 rounded-xl justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                  Try Again
                </button>
              ) : null}
              <button onClick={goToQuiz} className="btn-secondary flex-1 py-3 rounded-xl justify-center gap-2">
                <ClipboardList size={16} />
                {roadmapId ? "Review Roadmap" : "All Quizzes"}
              </button>
            </div>

            {/* Export */}
            <div className="devmap-card">
              <h2 className="font-semibold text-foreground mb-1">Export Results</h2>
              <p className="text-xs text-muted-foreground mb-4">Download your quiz results in your preferred format</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "JSON", icon: FileJson, action: () => exportHelper(quizId ?? "", quizTitle, "json", "quiz") },
                  { label: "CSV", icon: File, action: () => exportHelper(quizId ?? "", quizTitle, "csv", "quiz") },
                  { label: "PDF", icon: FileText, action: () => exportHelper(quizId ?? "", quizTitle, "pdf", "quiz") },
                ].map(({ label, icon: Icon, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-muted transition-all cursor-pointer"
                  >
                    <Icon size={20} className="text-primary" />
                    <span className="text-xs font-medium text-foreground">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Answer review */}
            <div className="devmap-card">
              <h2 className="font-bold text-foreground text-lg mb-5">Question Review</h2>
              <div className="space-y-3">
                {answerDetails?.map((item, index) => (
                  <motion.div
                    key={item?.questionId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`relative rounded-xl border p-4 ${
                      item?.isCorrect ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/20" : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {item?.isCorrect ? (
                        <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle size={16} className="text-destructive mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground leading-relaxed">{item?.question}</p>
                        <div className="mt-2 space-y-1 text-xs">
                          <p>
                            <span className="text-muted-foreground">Your answer: </span>
                            <span className={`font-semibold ${item?.isCorrect ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                              {item?.userAnswer || <em className="opacity-60">Not answered</em>}
                            </span>
                          </p>
                          {!item?.isCorrect && (
                            <p>
                              <span className="text-muted-foreground">Correct answer: </span>
                              <span className="font-semibold text-green-600 dark:text-green-400">{item?.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {isPassed && (
              <div className="devmap-card text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Award size={28} className="text-primary" />
                </div>
                <p className="font-bold text-foreground">Badge Unlocked!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You&apos;ve earned this for scoring {safePercentage}%+ on the {quizTitle} quiz.
                </p>
              </div>
            )}

            <div className="devmap-card">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">DevBot Feedback</p>
              <p className="text-xs text-muted-foreground mb-2">Personalized Analysis</p>
              <p className="text-sm text-foreground leading-relaxed">
                {isPassed
                  ? `Great job! You're really strong on this topic. ${wrongAnswers > 0 ? "Review the questions you missed to fully lock it in." : "Keep this momentum going!"}`
                  : "Don't worry — review the explanations below and give it another shot when you're ready."}
              </p>
            </div>

            <div className="devmap-card bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 flex items-center gap-3">
              <Flame size={18} className="text-orange-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Keep your streak alive!</p>
                <p className="text-xs text-muted-foreground">Come back tomorrow to continue learning.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pt-8 pb-4">© 2026 DevMap Learning. All rights reserved.</p>
      </div>
    </div>
  );
};

export default QuizResults;
