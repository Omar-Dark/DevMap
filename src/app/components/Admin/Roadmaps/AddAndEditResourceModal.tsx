"use client";
import { AddAndEditResourceModalProps } from "@/app/types/admin";
import { resourcesTypeSectionProps } from "@/app/types/roadmap";
import { useState } from "react";
import DropDownMenu from "../../UI/DropDownMenu";
import {
  validateEditResource,
  validateResourceCreation,
} from "@/app/validators";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const AddAndEditResourceModal = ({
  mode,
  Type,
  title,
  url,
  roadmapId,
  sectionId,
  onClose,
  resourceId,
  setSections,
}: AddAndEditResourceModalProps) => {
  const [currentTitle, setCurrentTitle] = useState<string>(
    mode === "ADD" ? "" : title || "",
  );
  const [currentURL, setCurrentURL] = useState<string>(
    mode === "ADD" ? "" : url || "",
  );

  const [currentType, setCurrentType] = useState<resourcesTypeSectionProps>(
    mode === "ADD" ? "video" : Type || "video",
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");


  const handleSubmitResource = async (mode: "ADD" | "EDIT") => {
    setLoading(true);
    if (mode === "ADD") {
      try {
        const message = validateResourceCreation(
          currentURL,
          currentTitle,
          currentType,
        );
        if (message) {
          setError(message as string);
          setLoading(false);
          return;
        }

        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Resource.createResourceToRoadmap.route(
            roadmapId ?? "",
            sectionId ?? "",
          ),
          {
            url: currentURL,
            title: currentTitle,
            type: currentType,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentType("article");
          setCurrentURL("");
          setError("");
          setSections((prev) => [...prev, res.data.resource]);
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
        const message = validateEditResource(
          currentURL,
          currentTitle,
          currentType,
        );
        if (message) {
          setError(message);
          setLoading(false);
          return;
        }
        const res = await RoadmapApiAxiosInstance.put(
          apiRoutes.Resource.updateResourceByIdToRoadmap.route(
            roadmapId ?? "",
            sectionId ?? "",
            resourceId ?? "",
          ),
          {
            title: currentTitle,
            url: currentURL,
            type: currentType,
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setCurrentTitle("");
          setCurrentType("article");
          setCurrentURL("");
          setError("");
          setSections((prev) =>
            prev.map((section) =>
              section._id === resourceId
                ? {
                    ...section,
                    title: currentTitle,
                    url: currentURL,
                    type: currentType,
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
      <p className="text-sm sm:text-lg font-bold">URL</p>
      <input
        value={currentURL}
        onChange={(e) => setCurrentURL(e.target.value)}
        type="text"
        id="description"
        placeholder="Enter description"
        className="border border-border bg-background rounded-lg p-2"
      />
      <p className="text-sm sm:text-lg font-bold">Media</p>
      <DropDownMenu
        option={mode === "ADD" ? `select Media` : `${currentType}`}
        optionList={["video", "article", "course"]}
        onChange={(value) => setCurrentType(value as resourcesTypeSectionProps)}
      />

      {error && (
        <p
          className={`text-destructive text-center ${error ? "opacity-100" : "opacity-0"}`}
        >
          {error}
        </p>
      )}

      <button
        onClick={() => handleSubmitResource(mode)}
        className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors gap-2 my-5 w-full max-w-md mx-auto"
      >
        {loading ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-white mx-auto"
            size={22}
          />
        ) : mode === "ADD" ? (
          `Create Resource`
        ) : (
          `Update Resource`
        )}
      </button>
    </div>
  );
};

export default AddAndEditResourceModal;
