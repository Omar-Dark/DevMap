import { difficultySectionProps } from "@/app/types/roadmap";
import { useState } from "react";
import DropDownMenu from "../../UI/DropDownMenu";
import { AddAndEditQuizModalProps } from "@/app/types/admin";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { validateQuizCreation, validateQuizEdit } from "@/app/validators";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddAndEditQuizModal = ({
  mode,
  title,
  description,
  rank,
  onClose,
  setQuizzes,
  id,
}: AddAndEditQuizModalProps) => {
  const [currentTitle, setCurrentTitle] = useState<string>(
    mode === "ADD" ? "" : title || "",
  );
  const [currentDescription, setCurrentDescription] = useState<string>(
    mode === "ADD" ? "" : description || "",
  );

  const [currentRank, setCurrentRank] = useState<difficultySectionProps>(
    mode === "ADD" ? "Beginner" : rank || "Beginner",
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const handleCreateOrEditQuiz = async (mode: "ADD" | "EDIT") => {
    setLoading(true);
    if (mode === "ADD") {
      try {
        const message = validateQuizCreation(
          currentTitle,
          currentDescription,
          currentRank,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }

        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Quiz.createQuiz.route,
          {
            title: currentTitle,
            description: currentDescription,
            rank: currentRank,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentDescription("");
          setCurrentRank("Beginner");
          setError("");
          setQuizzes((prev) => [
            ...(prev || []),
            {
              title: currentTitle,
              description: currentDescription,
              rank: currentRank,
              _id: res?.data?.quizData?._id,
            },
          ]);
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
        const message = validateQuizEdit(
          currentTitle,
          currentDescription,
          currentRank,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }
        const res = await RoadmapApiAxiosInstance.put(
          apiRoutes.Quiz.updateQuizById.route(id || ""),
          {
            title: currentTitle,
            description: currentDescription,
            rank: currentRank,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentDescription("");
          setCurrentRank("Beginner");
          setError("");
          setQuizzes((prev) => {
            return prev.map((quiz) => {
              if (quiz._id === id) {
                return {
                  ...quiz,
                  title: currentTitle,
                  description: currentDescription,
                  rank: currentRank,
                };
              }
              return quiz;
            });
          });
          onClose()
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
      <p className="text-sm sm:text-lg font-bold">Title</p>
      <input
        onChange={(e) => setCurrentTitle(e.target.value)}
        value={currentTitle}
        type="text"
        id="title"
        placeholder="Enter title"
        className="border border-border bg-background rounded-lg p-2"
      />
      <p className="text-sm sm:text-lg font-bold">Description</p>
      <input
        value={currentDescription}
        onChange={(e) => setCurrentDescription(e.target.value)}
        type="text"
        id="description"
        placeholder="Enter description"
        className="border border-border bg-background rounded-lg p-2"
      />
      <p className="text-sm sm:text-lg font-bold">Rank</p>
      <DropDownMenu
        onChange={(value) => setCurrentRank(value as difficultySectionProps)}
        optionList={[
          "Beginner",
          "Intermediate",
          "Advanced",
          "Expert",
          "Master",
        ]}
        option={
          mode === "ADD" ? "Beginner" : (currentRank as difficultySectionProps)
        }
      />

      {error && (
        <p
          className={`text-destructive text-center ${error ? "opacity-100" : "opacity-0"}`}
        >
          {error}
        </p>
      )}

      <button
        onClick={() => handleCreateOrEditQuiz(mode)}
        className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors gap-2 my-5 w-full max-w-md mx-auto"
      >
        {loading ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-white mx-auto"
            size={22}
          />
        ) : mode === "ADD" ? (
          `Create Quiz`
        ) : (
          `Update Quiz`
        )}
      </button>
    </div>
  );
};

export default AddAndEditQuizModal;
