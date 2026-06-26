import { ModalPayload, ProjectModalType } from "@/app/types/admin";
import { FaPlus } from "react-icons/fa";

const ProjectNotFound = ({
  toggleModal,
}: {
  toggleModal: (
    e: React.MouseEvent,
    payload?: ModalPayload,
    type?: ProjectModalType,
  ) => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <FaPlus size={24} className="text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-lg">No projects yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first project to get started.
        </p>
      </div>
      <button
        onClick={(e) => toggleModal(e, undefined, "ADD_PROJECT")}
        className="p-2 px-4 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors flex items-center gap-2"
      >
        <FaPlus /> New Project
      </button>
    </div>
  );
};

export default ProjectNotFound;
