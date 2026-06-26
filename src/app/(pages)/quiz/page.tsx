"use client";

import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapOrQuizItem from "@/app/components/Roadmap/RoadmapItem";
import { useEffect, useState } from "react";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import RoadmapItemSkeletonLoading from "@/app/components/Roadmap/RoadmapItemLoading";
import { quizProps } from "@/app/types/roadmap";
import { Trophy } from "lucide-react";

const Page = () => {
  const [quizzes, setQuizzes] = useState<quizProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await RoadmapApiAxiosInstance.get(apiRoutes.Quiz.getAllQuizzes.route);
        if (res.data.success) setQuizzes(res.data.quizData);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(axiosError.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wide">Quizzes</p>
          <h1 className="text-3xl font-bold text-foreground">Available Quizzes</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl">
            Test your knowledge with our collection of quizzes. Each quiz contains
            multiple-choice questions to help you assess your understanding.
          </p>
        </div>

        {loading ? (
          <RoadmapItemSkeletonLoading length={9} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz, i) => (
              <RoadmapOrQuizItem
                title={quiz.title}
                description={quiz.description}
                id={quiz._id!}
                mode="quiz"
                difficulty={quiz.rank}
                key={i}
                quizTitle={quiz.title}
                quizDescription={quiz.description}
              />
            ))}
            {quizzes.length === 0 && (
              <div className="col-span-3 text-center py-16">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Trophy size={20} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No quizzes available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
