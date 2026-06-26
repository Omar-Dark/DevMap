"use client";
import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { AddAndEditStepModalProps, StepProps } from "@/app/types/admin";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { validateEditSteps, validateStepsCreation } from "@/app/validators";

const AddAndEditStepModal = ({
  mode,
  projectId,
  stepId,
  initialTitle,
  initialDescription,
  onClose,
  onSuccess,
}: AddAndEditStepModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: initialTitle ?? "",
    description: initialDescription ?? "",
  });

  const handleSubmit = async () => {
    // Run the appropriate validator — same pattern as AddAndEditProjectModal
    const validationError =
      mode === "ADD"
        ? validateStepsCreation(form.title, form.description)
        : validateEditSteps(form.title, form.description);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let returnedStep: StepProps;

      if (mode === "ADD") {
        const res = await RoadmapApiAxiosInstance.post(
          apiRoutes.Steps.createStep.route(projectId),
          { steps: [form] },
        );
        if (!res.data.success) throw new Error(res.data.message);
        // Backend returns the full updated project; grab the last pushed step
        const updatedSteps: StepProps[] = res.data.project.steps;
        returnedStep = updatedSteps[updatedSteps.length - 1];
      } else {
        const res = await RoadmapApiAxiosInstance.put(
          apiRoutes.Steps.updateStep.route(projectId, stepId ?? ""),
          form,
        );
        if (!res.data.success) throw new Error(res.data.message);
        returnedStep = res.data.step;
      }

      toast.success(
        mode === "ADD"
          ? "Step added successfully"
          : "Step updated successfully",
      );
      onSuccess(returnedStep);
      onClose();
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
            placeholder="Enter step title"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Description</label>
        <div className="rounded-2xl border border-border bg-muted/60 px-4 py-3 focus-within:border-primary transition">
          <textarea
            rows={3}
            className="w-full bg-transparent outline-none text-sm resize-none"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe what to do in this step..."
          />
        </div>
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
            <FaPlus size={14} /> Add Step
          </>
        ) : (
          <>
            <FiEdit2 size={14} /> Update Step
          </>
        )}
      </button>
    </div>
  );
};

export default AddAndEditStepModal;
