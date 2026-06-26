import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { ProjectActiveModalProps } from "@/app/types/admin";
import toast from "react-hot-toast";
import Modal from "../../UI/Modal";
import AddAndEditProjectModal from "./AddAndEditProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import AddAndEditStepModal from "./AddAndEditStepModal";
import DeleteStepModal from "./DeleteStepModal";

const ProjectActiveModal = ({
  modal,
  onClose,
  setProjects,
  setStepsMap,
}: ProjectActiveModalProps) => {
  if (!modal.type) return null;

  const projectId = modal.payload?._id ?? "";

  const handleDeleteProject = async () => {
    await RoadmapApiAxiosInstance.delete(
      apiRoutes.Project.deleteProjectById.route(projectId),
    );
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
    toast.success("Project deleted successfully");
    onClose();
  };

  const handleDeleteStep = async () => {
    const stepId = modal.payload?.stepId ?? "";
    await RoadmapApiAxiosInstance.delete(
      apiRoutes.Steps.deleteStep.route(projectId, stepId),
    );
    setStepsMap((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] ?? []).filter((s) => s._id !== stepId),
    }));
    toast.success("Step deleted successfully");
    onClose();
  };

  switch (modal.type) {
    case "ADD_PROJECT":
      return (
        <Modal title="Create Project" isOpen onClose={onClose}>
          <AddAndEditProjectModal
            mode="ADD"
            onClose={onClose}
            onSuccess={(project) => setProjects((prev) => [project, ...prev])}
          />
        </Modal>
      );

    case "EDIT_PROJECT":
      return (
        <Modal title="Edit Project" isOpen onClose={onClose}>
          <AddAndEditProjectModal
            mode="EDIT"
            payload={modal.payload}
            onClose={onClose}
            onSuccess={(project) =>
              setProjects((prev) =>
                prev.map((p) =>
                  p._id === project._id ? { ...p, ...project } : p,
                ),
              )
            }
          />
        </Modal>
      );

    case "DELETE_PROJECT":
      return (
        <Modal isOpen onClose={onClose}>
          <DeleteProjectModal
            project={modal.payload}
            onCancel={onClose}
            onConfirm={handleDeleteProject}
          />
        </Modal>
      );

    case "ADD_STEP":
      return (
        <Modal title="Add Step" isOpen onClose={onClose}>
          <AddAndEditStepModal
            mode="ADD"
            projectId={projectId}
            onClose={onClose}
            onSuccess={(step) =>
              setStepsMap((prev) => ({
                ...prev,
                [projectId]: [...(prev[projectId] ?? []), step],
              }))
            }
          />
        </Modal>
      );

    case "EDIT_STEP":
      return (
        <Modal title="Edit Step" isOpen onClose={onClose}>
          <AddAndEditStepModal
            mode="EDIT"
            projectId={projectId}
            stepId={modal.payload?.stepId}
            initialTitle={modal.payload?.stepTitle}
            initialDescription={modal.payload?.stepDescription}
            onClose={onClose}
            onSuccess={(step) =>
              setStepsMap((prev) => ({
                ...prev,
                [projectId]: (prev[projectId] ?? []).map((s) =>
                  s._id === step._id ? { ...s, ...step } : s,
                ),
              }))
            }
          />
        </Modal>
      );

    case "DELETE_STEP":
      return (
        <Modal isOpen onClose={onClose}>
          <DeleteStepModal onCancel={onClose} onConfirm={handleDeleteStep} />
        </Modal>
      );

    default:
      return null;
  }
};

export default ProjectActiveModal;
