"use client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";
import { DeleteProjectModalProps } from "@/app/types/UI";
const DeleteProjectModal = ({
  project,
  onCancel,
  onConfirm,
}: DeleteProjectModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div>
      <p className="text-lg sm:text-xl font-bold text-center">
        Are you sure you want to delete{" "}
        <span className="text-destructive">&quot;{project?.title}&quot;</span>?
      </p>
      <p className="text-sm text-muted-foreground text-center mt-2">
        This action cannot be undone.
      </p>
      <div className="flex justify-end items-center gap-4 mt-6">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 cursor-pointer rounded-xl border border-border bg-card text-foreground font-medium transition-all duration-200 hover:bg-border active:scale-95"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-5 py-2.5 cursor-pointer rounded-xl bg-destructive text-destructive-foreground font-semibold shadow-md transition-all duration-200 hover:bg-destructive/90 active:scale-95 flex items-center gap-2 disabled:opacity-60"
        >
          {loading && (
            <AiOutlineLoading3Quarters className="animate-spin" size={16} />
          )}
          Delete Project
        </button>
      </div>
    </div>
  );
};
export default DeleteProjectModal;
