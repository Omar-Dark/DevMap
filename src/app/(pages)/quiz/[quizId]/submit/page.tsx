"use client";
import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import NotFoundQuizResults from "@/app/components/Quiz/NotFoundQuizResults";
import QuizResults from "@/app/components/Quiz/QuizResults";
import QuizResultsLoading from "@/app/components/Quiz/QuizResultsLoading";
import { quizResultsProps } from "@/app/types/api";
import { AxiosError } from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { quizId }    = useParams();
  const searchParams  = useSearchParams();
  const roadmapId     = searchParams.get("roadmapId");
  const minPassPct    = Number(searchParams.get("minPassPct") ?? "50");

  const [loading,    setLoading]    = useState(false);
  const [quizResult, setQuizResult] = useState<quizResultsProps>();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const storedQuestions = localStorage.getItem("questions");
        // The API expects: { answers: [{ _id: questionId, userAnswer: answerText }] }
        const questions: { _id: string; userAnswer: string }[] = storedQuestions
          ? JSON.parse(storedQuestions)
          : [];

        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Question.submitQuizAnswers.route(String(quizId)),
          { answers: questions },
        );
        if (res.data.success) {
          const result: quizResultsProps = res.data.result;
          setQuizResult(result);

          // If this quiz came from a roadmap, store whether they passed (≥ minPassPct)
          // so the roadmap detail page can unlock the project button
          if (roadmapId) {
            const pct = result.percentage ?? 0;
            if (pct >= minPassPct) {
              localStorage.setItem(`roadmap-quiz-passed-${roadmapId}`, "true");
            } else {
              // Clear in case they previously passed but are retaking
              localStorage.removeItem(`roadmap-quiz-passed-${roadmapId}`);
            }
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(axiosError.message || "Something went wrong");
      } finally {
        setLoading(false); }
    };
    if (quizId) fetchResults();
  }, [quizId, roadmapId, minPassPct]);

  if (loading)    return <QuizResultsLoading />;
  if (!quizResult) return <NotFoundQuizResults />;

  return (
    <QuizResults
      answerDetails={quizResult?.answerDetails ?? []}
      correctAnswers={quizResult?.correctAnswers ?? 0}
      grade={quizResult?.grade ?? "F"}
      percentage={quizResult?.percentage ?? 0}
      quizTitle={quizResult?.quizTitle ?? ""}
      status={quizResult?.status ?? "Failed"}
      totalQuestions={quizResult?.totalQuestions ?? 0}
      wrongAnswers={quizResult?.wrongAnswers ?? 0}
      quizId={quizResult?.quizId ?? ""}
      roadmapId={roadmapId}
      minPassPct={minPassPct}
    />
  );
};

export default Page;
