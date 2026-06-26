"use client";
import { useState } from "react";
import { AddAndEditProjectModalProps } from "../../../types/admin";
import { ProjectProps } from "../../../types/admin";
import RoadmapApiAxiosInstance from "../../../api/axiosInstance";
import { apiRoutes } from "../../../api/apiRoutes";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { DIFFICULTY_LEVELS } from "../../../data";
import difficultyStyle from "../../Roadmap/RoadmapItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import {
  validateEditProject,
  validateProjectCreation,
} from "../../../validators";
import { roadmapDummyDataProps } from "@/app/types/roadmap";
const AddAndEditProjectModal = ({
  mode,
  payload,
  onClose,
  onSuccess,
}: AddAndEditProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Omit<ProjectProps, "_id" | "createdAt">>({
    title: payload?.title ?? "",
    description: payload?.description ?? "",
    level: payload?.difficulty ?? "Beginner",
    tags: payload?.tags ?? [],
    roadmapId: payload?.roadmapId ?? "",
  });
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags?.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...(prev.tags ?? []), trimmed] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) =>
    setForm((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (mode === "ADD") {
        const message = validateProjectCreation(
          form.title,
          form.description ?? "",
          form.level,
          form.tags ?? [],
        );
        if (message) {
          setError(message);
          return;
        }

        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Project.createProject.route,
          form,
        );
        if (res.data.success) {
          toast.success("Project created successfully");
          onSuccess(res.data.project);
          onClose();
        }
      } else {
        const message = validateEditProject(
          form.title,
          form.description ?? "",
          form.level,
          form.tags ?? [],
        );
        if (message) {
          setError(message);
          return;
        }

        const res = await RoadmapApiAxiosInstance.put(
          apiRoutes.Project.updateProjectById.route(payload?._id ?? ""),
          form,
        );
        if (res.data.success) {
          toast.success("Project updated successfully");
          onSuccess(res.data.project);
          onClose();
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 py-1">
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Title</label>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-3 focus-within:border-primary transition">
          <input
            className="w-full bg-transparent outline-none text-sm"
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter project title"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Description{" "}
          <span className="text-muted-foreground/50 text-xs">(optional)</span>
        </label>
        <div className="rounded-2xl border border-border bg-muted/60 px-4 py-3 focus-within:border-primary transition">
          <textarea
            rows={3}
            className="w-full bg-transparent outline-none text-sm resize-none"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe the project..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Difficulty</label>
        <div className="flex gap-3">
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, level }))
              }
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                form.level === level
                  ? difficultyStyle(level as unknown as roadmapDummyDataProps) +
                    " border-current scale-[1.03] bg-primary text-white"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Tags{" "}
          <span className="text-muted-foreground/50 text-xs">(optional)</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-2.5 focus-within:border-primary transition">
            <input
              className="w-full bg-transparent outline-none text-sm"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="Add a tag and press Enter"
            />
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 rounded-xl border border-border bg-muted hover:bg-border transition text-sm font-medium cursor-pointer"
          >
            Add
          </button>
        </div>
        {(form.tags?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.tags?.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/30 rounded-full px-3 py-1 text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-destructive transition cursor-pointer leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full p-2.5 rounded-xl bg-primary/80 hover:bg-primary transition-all cursor-pointer font-bold text-white flex items-center gap-2 justify-center disabled:opacity-60"
      >
        {loading ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin" size={18} />
            Loading…
          </>
        ) : mode === "ADD" ? (
          <>
            <FaPlus size={14} /> Create Project
          </>
        ) : (
          <>
            <FiEdit2 size={14} /> Update Project
          </>
        )}
      </button>
    </div>
  );
};

export default AddAndEditProjectModal;
