import {
  ActiveModalPayloadQuizDataProps,
  ActiveQuizModalProps,
} from "@/app/types/admin";
import Modal from "../../UI/Modal";
import AddAndEditQuestionModal from "./AddAndEditQuestionModal";
import AddAndEditQuizModal from "./AddAndEditQuizModal";
import DeleteModal from "../Roadmaps/DeleteRoadmapModal";
import { QuestionItemProps } from "@/app/types/quiz";

const ActiveQuizModal = ({
  modal,
  onClose,
  setQuizzes,
  setQuestions,
}: ActiveQuizModalProps) => {
  if (!modal?.type) return null;

  switch (modal.type) {
    case "ADD_QUIZ": {
      const payload = modal.payload as ActiveModalPayloadQuizDataProps;

      return (
        <Modal title="Create Quiz" isOpen onClose={onClose}>
          <AddAndEditQuizModal
            id={payload?._id || payload?.id || ""}
            mode="ADD"
            onClose={onClose}
            setQuizzes={setQuizzes}
          />
        </Modal>
      );
    }

    case "EDIT_QUIZ": {
      const payload = modal.payload as ActiveModalPayloadQuizDataProps;

      return (
        <Modal title="Edit Quiz" isOpen onClose={onClose}>
          <AddAndEditQuizModal
            setQuizzes={setQuizzes}
            mode="EDIT"
            id={payload?._id || payload?.id}
            title={payload?.title}
            description={payload?.description}
            rank={payload?.rank}
            onClose={onClose}
          />
        </Modal>
      );
    }

    case "DELETE_QUIZ": {
      const payload = modal.payload as ActiveModalPayloadQuizDataProps;

      return (
        <Modal isOpen onClose={onClose}>
          <DeleteModal
            setQuizzes={setQuizzes}
            quizId={payload?._id || payload?.id || ""}
            setQuestions={setQuestions}
            mode="quiz"
            onCancel={onClose}
          />
        </Modal>
      );
    }

    case "ADD_QUESTION": {
      const payload = modal.payload as QuestionItemProps;
      return (
        <Modal title="Create Question" isOpen onClose={onClose}>
          <AddAndEditQuestionModal
            mode="ADD"
            setQuestions={setQuestions}
            quizId={payload?.quizId ?? ""}
            onClose={onClose}
            id={payload?._id ?? ""}
          />
        </Modal>
      );
    }

    case "EDIT_QUESTION": {
      const payload = modal.payload as QuestionItemProps;

      return (
        <Modal title="Edit Question" isOpen onClose={onClose}>
          <AddAndEditQuestionModal
            id={payload._id || ""}
            quizId={payload?.quizId || ""}
            onClose={onClose}
            setQuestions={setQuestions}
            mode="EDIT"
            answers={payload?.options}
            correctAnswer={payload?.answer}
            question={payload?.question}
          />
        </Modal>
      );
    }

    case "DELETE_QUESTION": {
      const payload = modal.payload as QuestionItemProps;

      return (
        <Modal isOpen onClose={onClose}>
          <DeleteModal
            mode="question"
            onCancel={onClose}
            setQuizzes={setQuizzes}
            setQuestions={setQuestions}
            questionId={payload._id || ""}
            quizId={payload?.quizId || ""}
          />
        </Modal>
      );
    }

    default:
      return null;
  }
};

export default ActiveQuizModal;
