import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { AddAndEditQuestionModalProps } from "@/app/types/admin";
import {
  validateEditQuestion,
  validateQuestionCreation,
} from "@/app/validators";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddAndEditQuestionModal = ({
  mode,
  question,
  answers,
  correctAnswer,
  setQuestions,
  id,
  quizId,
  onClose,
}: AddAndEditQuestionModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>(
    mode === "ADD" ? "" : question || "",
  );
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState<string>(
    mode === "ADD" ? "" : correctAnswer || "",
  );
  const [currentAnswers, setCurrentAnswers] = useState<string[]>(
    mode === "ADD" ? [] : answers || [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  console.log({ quizId });
  const handleCreateOrEditQuestions = async (mode: "ADD" | "EDIT") => {
    setLoading(true);
    if (mode === "ADD") {
      try {
        const message = validateQuestionCreation(
          currentQuestion,
          currentCorrectAnswer,
          currentAnswers,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }

        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Question.createQuestionFromQuiz.route(quizId),
          {
            question: currentQuestion,
            answer: currentCorrectAnswer,
            options: currentAnswers,
          },
        );
        console.log(res.data);
        if (res.data.success) {
          console.log(res.data);
          toast.success(res.data.message);
          setCurrentQuestion("");
          setCurrentAnswers([]);
          setCurrentCorrectAnswer("");
          setError("");
          setQuestions((prev) => ({
            ...prev,
            questions: res.data.question
              ? [...prev.questions, res.data.question]
              : prev.questions,
            totalQuestions: prev.totalQuestions + 1,
          }));
          onClose();
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.message || "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    } else if (mode === "EDIT") {
      try {
        const message = validateEditQuestion(
          currentQuestion,
          currentCorrectAnswer,
          currentAnswers,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }
        const res = await RoadmapApiAxiosInstance.put(
          apiRoutes.Question.updateQuestionFromQuiz.route(quizId, id),
          {
            question: currentQuestion,
            answer: currentCorrectAnswer,
            options: currentAnswers,
          },
        );
        console.log(res.data);
        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentAnswers([]);
          setCurrentCorrectAnswer("");
          setCurrentQuestion("");
          setError("");
          setQuestions((prev) => ({
            ...prev,
            questions: prev.questions.map((question) => {
              if (!question) return question;

              return question._id === id
                ? { ...question, ...res.data.question }
                : question;
            }),
          }));
          onClose();
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.message || "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm sm:text-lg font-bold">Question</p>
      <input
        onChange={(e) => setCurrentQuestion(e.target.value)}
        value={currentQuestion}
        type="text"
        id="question"
        placeholder="Enter Question"
        className="border border-border bg-background rounded-lg p-2"
      />
      <p className="text-sm sm:text-lg font-bold">Answers</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
        {Array.from({ length: 4 }, (_, index) => (
          <input
            key={index}
            value={currentAnswers[index] || ""}
            onChange={(e) =>
              setCurrentAnswers((prev) => {
                const updated = [...prev];
                updated[index] = e.target.value;
                return updated;
              })
            }
            type="text"
            id={`answer-${index + 1}`}
            placeholder="Enter Answer"
            className="border border-border bg-background rounded-lg p-2 w-full"
          />
        ))}
      </div>

      <p className="text-sm sm:text-lg font-bold">Correct Answer</p>
      <input
        value={currentCorrectAnswer}
        onChange={(e) => setCurrentCorrectAnswer(e.target.value)}
        type="text"
        id="correctAnswer"
        placeholder="Enter Correct Answer"
        className="border border-border bg-background rounded-lg p-2"
      />

      {error && (
        <p
          className={`text-destructive text-center ${error ? "opacity-100" : "opacity-0"}`}
        >
          {error}
        </p>
      )}

      <button
        onClick={() => handleCreateOrEditQuestions(mode)}
        className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors gap-2 my-5 w-full max-w-md mx-auto"
      >
        {loading ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-white mx-auto"
            size={22}
          />
        ) : mode === "ADD" ? (
          `Create Questions`
        ) : (
          `Update Questions`
        )}
      </button>
    </div>
  );
};

export default AddAndEditQuestionModal;
