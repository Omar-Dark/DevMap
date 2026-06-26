"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { roadmapProps, userProgressProps } from "@/app/types/api";
import RoadmapDetailsLoading from "@/app/components/Roadmap/RoadmapDetailsLoading";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Modal from "@/app/components/UI/Modal";
import RoadmapContentsList from "@/app/components/Roadmap/RoadmapContentsList";
import ProgressCircle from "@/app/components/Roadmap/ProgressCircle";
import RoadmapDetailsSections from "@/app/components/Roadmap/RoadmapDetailsSections";
import ExportBTN from "@/app/components/UI/ExportBTN";
import { exportHelper } from "@/app/helper";
import { sectionDataProps } from "@/app/types/roadmap";
import { ChevronRight, BookOpen, Clock, Users, Sparkles, Trophy, ArrowRight, RotateCcw, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ── Quiz result popup shown after completing the roadmap quiz ────────
interface QuizResultPopupProps {
  percentage: number;
  passed: boolean;
  roadmapTitle: string;
  projectId?: string;
  projectTitle?: string;
  onRetry: () => void;
  onClose: () => void;
}

function QuizResultPopup({
  percentage, passed, roadmapTitle, projectId, projectTitle, onRetry, onClose,
}: QuizResultPopupProps) {
  return (
    <div className="text-center space-y-5 py-2">
      {passed ? (
        // ── 100% special congrats ──────────────────────────────────
        percentage === 100 ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="text-6xl mb-2">🎉</div>
            <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-3">
              <Trophy size={36} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Perfect Score!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You scored 100% on the <span className="font-semibold text-foreground">{roadmapTitle}</span> quiz. Absolutely outstanding! 🏆
            </p>
          </motion.div>
        ) : (
          // ── Passed (≥50%) ─────────────────────────────────────────
          <div>
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Quiz Passed! 🎊</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You scored <span className="font-bold text-green-500">{percentage}%</span>. You've unlocked the project!
            </p>
          </div>
        )
      ) : (
        // ── Failed (<50%) ─────────────────────────────────────────
        <div>
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
            <X size={32} className="text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Not Quite Yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You scored <span className="font-bold text-destructive">{percentage}%</span>. You need at least 50% to unlock the project.
          </p>
          <p className="text-xs text-muted-foreground mt-1">Review the roadmap sections and try again!</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {passed && projectId ? (
          <Link
            href={`/project/${projectId}`}
            className="btn-primary flex-1 py-2.5 rounded-xl justify-center text-sm"
            onClick={onClose}
          >
            <ArrowRight size={14} /> Go to Project
          </Link>
        ) : null}
        {!passed && (
          <button onClick={onRetry} className="btn-primary flex-1 py-2.5 rounded-xl justify-center text-sm">
            <RotateCcw size={14} /> Try Again
          </button>
        )}
        <button onClick={onClose} className="btn-secondary flex-1 py-2.5 rounded-xl justify-center text-sm">
          {passed ? "Close" : "Review Roadmap"}
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
const Page = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { roadmapId } = useParams();

  const [roadmapDetails, setRoadmapDetails] = useState<roadmapProps>();
  const [userProgress, setUserProgress] = useState<userProgressProps>();
  const [sectionDetails, setSectionDetails] = useState<sectionDataProps[]>();
  const [loading, setLoading] = useState(true);
  const [showCompletedCongrats, setShowCompletedCongrats] = useState(false);

  // Quiz result modal state
  const [quizResultModal, setQuizResultModal] = useState<{
    open: boolean;
    percentage: number;
    passed: boolean;
  }>({ open: false, percentage: 0, passed: false });

  const isFullyCompleted =
    !!userProgress &&
    (userProgress.total ?? 0) > 0 &&
    (userProgress.completed ?? 0) === userProgress.total;

  // The embedded quiz/project from the API (new backend feature)
  const embeddedQuiz    = userProgress?.roadmap?.quiz    ?? roadmapDetails?.quiz    ?? null;
  const embeddedProject = userProgress?.roadmap?.project ?? roadmapDetails?.project ?? null;

  // Check if this user already passed the quiz for this roadmap
  const quizPassStorageKey = `roadmap-quiz-passed-${roadmapId}`;
  const [quizAlreadyPassed, setQuizAlreadyPassed] = useState(false);

  useEffect(() => {
    setQuizAlreadyPassed(!!localStorage.getItem(quizPassStorageKey));
  }, [quizPassStorageKey]);

  useEffect(() => {
    if (!userProgress || !isAuthenticated) return;
    const { completed = 0, total = 0 } = userProgress;
    if (total > 0 && completed === total) {
      const storageKey = `roadmap-completed-${roadmapId}`;
      if (!localStorage.getItem(storageKey)) {
        setShowCompletedCongrats(true);
        localStorage.setItem(storageKey, "true");
      }
    }
  }, [userProgress, roadmapId, isAuthenticated]);

  const fetchProgress = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const res = await RoadmapApiAxiosInstance.get(
          apiRoutes.Roadmap.getProgress.route(roadmapId?.toString() || "1")
        );
        if (res.data.success) setUserProgress(res.data);
      } else {
        const [roadmapRes, sectionRes] = await Promise.all([
          RoadmapApiAxiosInstance.get(apiRoutes.Roadmap.getRoadmapById.route(roadmapId?.toString() || "1")),
          RoadmapApiAxiosInstance.get(apiRoutes.Section.getAllRoadmapSections.route(roadmapId?.toString() || "1")),
        ]);
        if (roadmapRes.data.success) setRoadmapDetails(roadmapRes.data.roadmap);
        if (sectionRes.data.success) setSectionDetails(sectionRes.data.sections);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [roadmapId, isAuthenticated]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  if (loading) return <RoadmapDetailsLoading />;

  const title       = isAuthenticated ? userProgress?.roadmap.title       : roadmapDetails?.title;
  const description = isAuthenticated ? userProgress?.roadmap.description : roadmapDetails?.description;
  const progressPct = userProgress
    ? Math.round(((userProgress.completed || 0) / (userProgress.total || 1)) * 100)
    : 0;

  // ── Handle "Take Quiz" button click ─────────────────────────────
  // Routes to the actual quiz page — result is checked on submit
  // The quiz result page already supports roadmapId passthrough
  const takeQuizLink = embeddedQuiz
    ? {
        pathname: `/quiz/${embeddedQuiz._id}`,
        query: {
          quizTitle: embeddedQuiz.title,
          quizDescription: embeddedQuiz.description ?? "",
          roadmapId: String(roadmapId),
          minPassPct: "50",  // hint for submit page
        },
      }
    : null;

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Link href="/roadmap" className="hover:text-primary transition-colors">Roadmaps</Link>
            <ChevronRight size={12} />
            <span className="text-primary font-medium">{title}</span>
          </nav>

          <div className={`grid grid-cols-1 gap-6 ${isAuthenticated ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {/* Left: table of contents */}
            <RoadmapContentsList
              isAuthenticated={isAuthenticated}
              sectionDetails={sectionDetails}
              userProgress={userProgress}
            />

            {/* Center */}
            <div className="lg:col-span-2 space-y-6">
              <div className="devmap-card">
                <div className="flex flex-wrap items-start gap-3 mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                    Software Engineering
                  </span>
                  {isFullyCompleted && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 uppercase tracking-wide">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{title}</h1>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-5">
                  <span className="flex items-center gap-1.5"><BookOpen size={13} /> Beginner Level</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> 12 Weeks</span>
                  <span className="flex items-center gap-1.5"><Users size={13} /> Active Community</span>
                </div>

                {isAuthenticated && userProgress && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="text-primary font-bold">{progressPct}%</span>
                      </div>
                      <div className="devmap-progress">
                        <div className="devmap-progress-fill" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* Take Quiz button — only shows when fully completed */}
                      {isFullyCompleted && embeddedQuiz && takeQuizLink ? (
                        <Link href={takeQuizLink} className="btn-primary text-sm px-5 py-2.5 rounded-xl gap-2">
                          <Sparkles size={14} />
                          {quizAlreadyPassed ? "Retake Quiz" : "Take Quiz"}
                        </Link>
                      ) : !isFullyCompleted ? (
                        <button className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                          Continue Learning
                        </button>
                      ) : null}

                      {/* Go to Project — only unlocked after passing the quiz */}
                      {isFullyCompleted && embeddedProject && quizAlreadyPassed && (
                        <Link href={`/project/${embeddedProject._id}`} className="btn-secondary text-sm px-5 py-2.5 rounded-xl gap-2">
                          <ArrowRight size={14} /> View Project
                        </Link>
                      )}

                      {/* If no embedded quiz, fall back to search-based matching */}
                      {isFullyCompleted && !embeddedQuiz && (
                        <Link href="/quiz" className="btn-primary text-sm px-5 py-2.5 rounded-xl gap-2">
                          <Sparkles size={14} /> Browse Quizzes
                        </Link>
                      )}
                    </div>

                    {/* Hint text below buttons */}
                    {isFullyCompleted && embeddedQuiz && !quizAlreadyPassed && (
                      <p className="text-xs text-muted-foreground">
                        Pass the quiz with <span className="font-semibold text-primary">50%+</span> to unlock the project.
                      </p>
                    )}
                  </div>
                )}

                {isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <ExportBTN
                      exportToCSV={() => exportHelper(String(roadmapId), title ?? "", "csv", "roadmap")}
                      exportToJSON={() => exportHelper(String(roadmapId), title ?? "", "json", "roadmap")}
                      exportToPDF={() => exportHelper(String(roadmapId), title ?? "", "pdf", "roadmap")}
                      id={String(roadmapId!)}
                      title={title ?? ""}
                    />
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Learning Roadmap</h2>
                <RoadmapDetailsSections
                  userProgress={userProgress}
                  isAuthenticated={isAuthenticated}
                  setUserProgress={setUserProgress}
                  sectionDetails={sectionDetails}
                />
              </div>
            </div>

            {/* Right sidebar */}
            {isAuthenticated && userProgress && (
              <div className="space-y-4">
                <ProgressCircle userProgress={userProgress} />

                {isFullyCompleted && (
                  <div className="devmap-card text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Trophy size={20} className="text-primary" />
                    </div>
                    <p className="font-semibold text-sm text-foreground mb-1">Roadmap Complete!</p>
                    {embeddedQuiz ? (
                      <>
                        <p className="text-xs text-muted-foreground mb-3">
                          {quizAlreadyPassed
                            ? "You passed the quiz. Access your project below."
                            : "Take the quiz to validate your skills and unlock the project."}
                        </p>
                        {!quizAlreadyPassed && takeQuizLink && (
                          <Link href={takeQuizLink} className="btn-primary w-full justify-center text-sm py-2.5 rounded-xl">
                            <Sparkles size={14} /> Take Quiz
                          </Link>
                        )}
                        {quizAlreadyPassed && embeddedProject && (
                          <Link href={`/project/${embeddedProject._id}`} className="btn-primary w-full justify-center text-sm py-2.5 rounded-xl">
                            <ArrowRight size={14} /> Go to Project
                          </Link>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Browse quizzes to validate your knowledge.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Roadmap first-time completion congrats */}
      {showCompletedCongrats && (
        <Modal title="Congratulations!" isOpen={showCompletedCongrats} onClose={() => setShowCompletedCongrats(false)}>
          <div className="text-center space-y-5 py-2">
            <div className="text-5xl mb-2">🎉</div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Roadmap Complete!</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                You finished <span className="font-semibold text-foreground">{title}</span>.
                {embeddedQuiz ? " Take the quiz to validate your knowledge and unlock the project!" : " Keep building your skills!"}
              </p>
            </div>
            <div className="flex gap-3">
              {embeddedQuiz && takeQuizLink ? (
                <Link href={takeQuizLink} className="btn-primary flex-1 py-2.5 rounded-xl justify-center text-sm" onClick={() => setShowCompletedCongrats(false)}>
                  <Sparkles size={14} /> Take Quiz
                </Link>
              ) : null}
              <button onClick={() => setShowCompletedCongrats(false)} className="btn-secondary flex-1 py-2.5 rounded-xl justify-center text-sm">
                Stay Here
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Page;
