"use client";
import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { DeleteModalProps } from "@/app/types/admin";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
const DeleteModal = ({
  onCancel,
  mode,
  setQuizzes,
  setQuestions,
  setRoadmaps,
  setSections,
  quizId,
  questionId,
  roadmapId,
  sectionId,
  resourceId,
}: DeleteModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleDeleteModal = async () => {
    try {
      setLoading(true);
      const res = await RoadmapApiAxiosInstance.delete(
        mode === "quiz"
          ? apiRoutes.Quiz.deleteQuizById.route(quizId ?? "")
          : mode === "question"
            ? apiRoutes.Question.deleteQuestionFromQuiz.route(
                quizId!,
                questionId!,
              )
            : mode === "roadmap"
              ? apiRoutes.Roadmap.deleteRoadmapById.route(roadmapId ?? "")
              : mode === "section"
                ? apiRoutes.Section.deleteSectionToRoadmap.route(
                    roadmapId ?? "",
                    sectionId ?? "",
                  )
                : mode === "resource"
                  ? apiRoutes.Resource.deleteResourceByIdToRoadmap.route(
                      roadmapId ?? "",
                      sectionId ?? "",
                      resourceId ?? "",
                    )
                  : "",
      );

      if (res.data.success) {
        setQuizzes!((prev) => prev?.filter((quiz) => quiz._id !== quizId));
        setQuestions!((prev) => ({
          ...prev,
          questions: prev?.questions?.filter(
            (question) => question._id !== questionId,
          ),
        }));
        setRoadmaps!((prev) =>
          prev?.filter((roadmap) => roadmap._id !== roadmapId),
        );
        setSections!((prev) =>
          prev?.filter((section) => section._id !== sectionId),
        );
        setSections!((prev) =>
          prev?.filter((section) =>
            section.resources.filter((r) => r._id !== resourceId),
          ),
        );
        toast.success(res.data.message);
        setLoading(false);
        onCancel(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <p className="text-lg sm:text-xl font-bold text-center">
        Are you sure you want to delete{" "}
        {mode === "roadmap"
          ? "Roadmap"
          : mode === "section"
            ? "Section"
            : mode === "resource"
              ? "Resource"
              : mode === "question"
                ? "Question"
                : "Quiz"}
      </p>
      <div className="flex justify-end items-center gap-4 mt-5">
        <button
          onClick={() => onCancel(false)}
          className="px-5 py-2.5 cursor-pointer rounded-xl border border-border bg-card text-foreground font-medium transition-all duration-200 hover:bg-border active:scale-95"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteModal}
          className="px-5 py-2.5 cursor-pointer rounded-xl bg-destructive text-destructive-foreground font-semibold shadow-md transition-all duration-200 hover:bg-destructive/90 hover:shadow-lg active:scale-95"
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              Delete{" "}
              {mode === "roadmap"
                ? "Roadmap"
                : mode === "section"
                  ? "Section"
                  : mode === "resource"
                    ? "Resource"
                    : mode === "question"
                      ? "Question"
                      : "Quiz"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
