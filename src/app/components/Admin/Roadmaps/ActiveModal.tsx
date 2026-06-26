import AddAndEditResourceModal from "./AddAndEditResourceModal";
import AddAndEditSectionModal from "./AddAndEditSectionModal";
import DeleteModal from "./DeleteRoadmapModal";
import AddAndEditRoadmapModal from "./AddAndEditRoadmapModal";
import Modal from "../../UI/Modal";
import { ActiveModalProps } from "@/app/types/admin";
const ActiveModal = ({
  modal,
  onClose,
  setRoadmaps,
  setSections,
}: ActiveModalProps) => {
  if (!modal.type) return null;

  switch (modal.type) {
    case "ADD_ROADMAP":
      return (
        <Modal title="Create Roadmap" isOpen onClose={onClose}>
          <AddAndEditRoadmapModal
            setRoadmaps={setRoadmaps}
            roadmapId={modal?.payload?._id}
            onClose={onClose}
            mode="ADD"
          />
        </Modal>
      );

    case "EDIT_ROADMAP":
      return (
        <Modal title="Edit Roadmap" isOpen onClose={onClose}>
          <AddAndEditRoadmapModal
            setRoadmaps={setRoadmaps}
            roadmapId={modal.payload?._id}
            onClose={onClose}
            mode="EDIT"
            title={modal.payload?.title}
            description={modal.payload?.description}
          />
        </Modal>
      );

    case "DELETE_ROADMAP":
      return (
        <Modal isOpen onClose={onClose}>
          <DeleteModal
            roadmapId={modal.payload?._id}
            mode="roadmap"
            onCancel={onClose}
            setRoadmaps={setRoadmaps}
          />
        </Modal>
      );

    case "ADD_SECTION":
      return (
        <Modal title="Create Section" isOpen onClose={onClose}>
          <AddAndEditSectionModal
            mode="ADD"
            roadmapId={modal.payload?._id}
            onClose={onClose}
            setSections={setSections}
          />
        </Modal>
      );

    case "EDIT_SECTION":
      return (
        <Modal title="Edit Section" isOpen onClose={onClose}>
          <AddAndEditSectionModal
            onClose={onClose}
            setSections={setSections}
            sectionId={modal.payload?._id}
            roadmapId={modal.payload?.roadmapId}
            mode="EDIT"
            title={modal.payload?.title}
            description={modal.payload?.description}
            difficulty={modal.payload?.difficulty}
          />
        </Modal>
      );

    case "DELETE_SECTION":
      return (
        <Modal isOpen onClose={onClose}>
          <DeleteModal
            roadmapId={modal.payload?.roadmapId}
            mode="section"
            onCancel={onClose}
            setSections={setSections}
            sectionId={modal.payload?._id}
          />
        </Modal>
      );

    case "ADD_RESOURCE":
      return (
        <Modal title="Create Resource" isOpen onClose={onClose}>
          <AddAndEditResourceModal
            setSections={setSections}
            mode="ADD"
            onClose={onClose}
            sectionId={modal.payload?._id}
            roadmapId={modal.payload?.roadmapId}
          />
        </Modal>
      );

    case "EDIT_RESOURCE":
      return (
        <Modal title="Edit Resource" isOpen onClose={onClose}>
          <AddAndEditResourceModal
            setSections={setSections}
            mode="EDIT"
            title={modal.payload?.title}
            onClose={onClose}
            resourceId={modal.payload?._id}
            roadmapId={modal.payload?.roadmapId}
            sectionId={modal.payload?.sectionId}
            Type={modal.payload?.type}
            url={modal.payload?.url}
          />
        </Modal>
      );

    case "DELETE_RESOURCE":
      return (
        <Modal isOpen onClose={onClose}>
          <DeleteModal
            mode="resource"
            onCancel={onClose}
            setSections={setSections}
            resourceId={modal.payload?._id}
            sectionId={modal.payload?.sectionId}
            roadmapId={modal.payload?.roadmapId}
          />
        </Modal>
      );

    default:
      return null;
  }
};

export default ActiveModal;
