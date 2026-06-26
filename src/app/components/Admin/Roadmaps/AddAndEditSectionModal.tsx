import { useState } from "react";
import DropDownMenu from "../../UI/DropDownMenu";
import { difficultySectionProps } from "@/app/types/roadmap";
import { AddAndEditSectionModalProps } from "@/app/types/admin";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { apiRoutes } from "@/app/api/apiRoutes";
import { validateEditSection, validateSectionCreation } from "@/app/validators";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddAndEditSectionModal = ({
  mode,
  title,
  description,
  difficulty,
  setSections,
  onClose,
  sectionId,
  roadmapId,
}: AddAndEditSectionModalProps) => {
  const [currentTitle, setCurrentTitle] = useState<string>(
    mode === "ADD" ? "" : title || "",
  );
  const [currentDescription, setCurrentDescription] = useState<string>(
    mode === "ADD" ? "" : description || "",
  );
  const [currentDifficulty, setCurrentDifficulty] =
    useState<difficultySectionProps>(
      mode === "ADD" ? "Beginner" : difficulty || "Beginner",
    );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleAddOrEditSection = async (mode: "ADD" | "EDIT") => {
    setLoading(true);
    if (mode === "ADD") {
      try {
        const message = validateSectionCreation(
          currentTitle,
          currentDescription,
          currentDifficulty,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }

        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Section.createSectionToRoadmap.route(roadmapId ?? ""),
          {
            title: currentTitle,
            description: currentDescription,
            difficulty: currentDifficulty,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentDescription("");
          setCurrentDifficulty("Beginner");
          setError("");
          setSections((prev) => [...prev, res.data.section]);
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
        const message = validateEditSection(
          currentTitle,
          currentDescription,
          currentDifficulty,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }
        const res = await RoadmapApiAxiosInstance.put(
          apiRoutes.Section.updateSectionToRoadmap.route(
            roadmapId ?? "",
            sectionId ?? "",
          ),
          {
            title: currentTitle,
            description: currentDescription,
            difficulty: currentDifficulty,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentDescription("");
          setError("");
          setSections((prev) =>
            prev.map((section) =>
              section._id === sectionId
                ? {
                    ...section,
                    title: currentTitle,
                    description: currentDescription,
                    difficulty: currentDifficulty,
                  }
                : section,
            ),
          );
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
      <p className="text-sm sm:text-lg font-bold">Difficulty</p>
      <DropDownMenu
        option={mode === "ADD" ? `select Difficulty` : `${currentDifficulty}`}
        optionList={["Beginner", "Intermediate", "Advanced", "Expert"]}
        onChange={(value) =>
          setCurrentDifficulty(value as difficultySectionProps)
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
        onClick={() => handleAddOrEditSection(mode)}
        className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors gap-2 my-5 w-full max-w-md mx-auto"
      >
        {loading ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-white mx-auto"
            size={22}
          />
        ) : mode === "ADD" ? (
          `Create Section`
        ) : (
          `Update Section`
        )}
      </button>
    </div>
  );
};

export default AddAndEditSectionModal;
