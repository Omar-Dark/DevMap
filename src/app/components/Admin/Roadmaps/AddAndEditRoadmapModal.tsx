import { useState } from "react";
import { AddAndEditRoadmapModalProps } from "@/app/types/admin";
import { validateEditRoadmap, validateRoadmapCreation } from "@/app/validators";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddAndEditRoadmapModal = ({
  mode,
  title,
  description,
  onClose,
  roadmapId,
  setRoadmaps,
}: AddAndEditRoadmapModalProps) => {
  const [currentTitle, setCurrentTitle] = useState<string>(
    mode === "ADD" ? "" : title || "",
  );
  const [currentDescription, setCurrentDescription] = useState<string>(
    mode === "ADD" ? "" : description || "",
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const handleAddOrEditRoadmap = async (mode: "ADD" | "EDIT") => {
    setLoading(true);
    if (mode === "ADD") {
      try {
        const message = validateRoadmapCreation(
          currentTitle,
          currentDescription,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }

        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Roadmap.createRoadmap.route,
          {
            title: currentTitle,
            description: currentDescription,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentDescription("");
          setError("");
          setRoadmaps((prev) => [
            ...prev,
            {
              title: res.data.roadmap.title,
              description: res.data.roadmap.description,
              id: res.data.roadmap._id,
              sections: [],
              _id: res.data.roadmap._id,
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
        const message = validateEditRoadmap(currentTitle, currentDescription);
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }
        const res = await RoadmapApiAxiosInstance.put(
          apiRoutes.Roadmap.updateRoadmapById.route(roadmapId ?? ""),
          {
            title: currentTitle,
            description: currentDescription,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentDescription("");
          setError("");
          setRoadmaps((prev) =>
            prev.map((roadmap) =>
              roadmap?._id === roadmapId
                ? {
                    ...roadmap,
                    title: currentTitle,
                    description: currentDescription,
                  }
                : roadmap,
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

      {error && (
        <p
          className={`text-destructive text-center ${error ? "opacity-100" : "opacity-0"}`}
        >
          {error}
        </p>
      )}
      <button
        onClick={() => handleAddOrEditRoadmap(mode)}
        className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors gap-2 my-5 w-full max-w-md mx-auto"
      >
        {loading ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-white mx-auto"
            size={22}
          />
        ) : mode === "ADD" ? (
          `Create Roadmap`
        ) : (
          `Update Roadmap`
        )}
      </button>
    </div>
  );
};

export default AddAndEditRoadmapModal;
