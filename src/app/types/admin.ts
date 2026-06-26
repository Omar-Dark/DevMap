import {
  difficultySectionProps,
  quizProps,
  resourcesTypeSectionProps,
  sectionDataProps,
} from "./roadmap";
import { Dispatch, SetStateAction } from "react";
import { WindowProps } from "./UI";
import { QuestionProps, roadmapProps, UsersProps } from "./api";
import { QuestionItemProps } from "./quiz";

export interface AddAndEditResourceModalProps {
  mode: "ADD" | "EDIT";
  url?: string;
  Type?: resourcesTypeSectionProps;
  title?: string;
  roadmapId?: string;
  sectionId?: string;
  resourceId?: string;
  onClose: () => void;
  setSections: Dispatch<SetStateAction<sectionDataProps[]>>;
}

export interface AddAndEditRoadmapModalProps {
  mode: "ADD" | "EDIT";
  title?: string;
  description?: string;
  onClose: () => void;
  roadmapId?: string;
  setRoadmaps: Dispatch<SetStateAction<roadmapProps[]>>;
}

export interface AddAndEditSectionModalProps {
  mode: "ADD" | "EDIT";
  title?: string;
  description?: string;
  difficulty?: difficultySectionProps;
  setSections: Dispatch<SetStateAction<sectionDataProps[]>>;
  onClose: () => void;
  sectionId?: string;
  roadmapId?: string;
}

export interface AddAndEditQuestionModalProps {
  mode: `ADD` | `EDIT`;
  question?: string;
  answers?: string[];
  correctAnswer?: string;
  setQuestions: Dispatch<SetStateAction<QuestionProps>>;
  id: string;
  quizId: string;
  onClose: () => void;
}

export type adminTypeProps = "roadmaps" | "quizzes" | "users" | "projects";

export type ModalTypeProps =
  | "ADD_ROADMAP"
  | "EDIT_ROADMAP"
  | "DELETE_ROADMAP"
  | "ADD_SECTION"
  | "EDIT_SECTION"
  | "DELETE_SECTION"
  | "ADD_RESOURCE"
  | "EDIT_RESOURCE"
  | "DELETE_RESOURCE"
  | null;

export type ModalQuizTypeProps =
  | "ADD_QUIZ"
  | "EDIT_QUIZ"
  | "DELETE_QUIZ"
  | "ADD_QUESTION"
  | "EDIT_QUESTION"
  | "DELETE_QUESTION"
  | null;

export interface ActiveModalStateProps {
  type: ModalTypeProps;
  payload?: ActiveModalPayloadDataProps;
}

export interface ActiveModalPayloadQuizDataProps {
  title?: string;
  description?: string;
  rank?: difficultySectionProps;
  question?: string;
  answers?: string[];
  correctAnswer?: string;
  _id?: string;
  id?: string;
  quizId?:string
}

export interface ActiveModalPayloadDataProps {
  _id?: string;
  title?: string;
  description?: string;
  difficulty?: difficultySectionProps;
  type?: resourcesTypeSectionProps;
  url?: string;
  roadmapId?: string;
  sectionId?: string;
  resourceId?: string;
}

export interface ActiveQuizModalStateProps {
  type: ModalQuizTypeProps;
  payload?: ActiveModalPayloadQuizDataProps;
}
export interface ActiveQuestionModalStateProps {
  type: ModalQuizTypeProps;
  payload?: QuestionItemProps;
}

export interface DeleteModalProps {
  onCancel: Dispatch<SetStateAction<boolean>>;
  mode: `roadmap` | `section` | `resource` | `quiz` | `question`;
  questionId?: string;
  setQuizzes?: Dispatch<SetStateAction<quizProps[]>>;
  setQuestions?: Dispatch<SetStateAction<QuestionProps>>;
  setRoadmaps?: Dispatch<SetStateAction<roadmapProps[]>>;
  setSections?: Dispatch<SetStateAction<sectionDataProps[]>>;
  quizId?: string;
  roadmapId?: string;
  sectionId?: string;
  resourceId?: string;
}

export type roleTypeProps = "User" | "Admin" | "select a role";

export interface ActiveModalProps {
  modal: ActiveModalStateProps;
  onClose: () => void;
  setRoadmaps: Dispatch<SetStateAction<roadmapProps[]>>;
  setSections: Dispatch<SetStateAction<sectionDataProps[]>>;
}

export interface ActiveQuizModalProps {
  modal: ActiveQuizModalStateProps | ActiveQuestionModalStateProps;
  onClose: () => void;
  setQuizzes: Dispatch<SetStateAction<quizProps[]>>;
  setQuestions: Dispatch<SetStateAction<QuestionProps>>;
}

export interface AddAndEditQuizModalProps {
  mode: "ADD" | "EDIT";
  title?: string;
  description?: string;
  rank?: difficultySectionProps;
  onClose: () => void;
  setQuizzes: Dispatch<SetStateAction<quizProps[]>>;
  id?: string;
}

export interface DeleteUserModalProps {
  onCancel: Dispatch<SetStateAction<WindowProps>>;
  setUserData: Dispatch<SetStateAction<UsersProps>>;
  userId: string;
}
export type ProjectModalType =
  | "ADD_PROJECT"
  | "EDIT_PROJECT"
  | "DELETE_PROJECT"
  | "ADD_STEP"
  | "EDIT_STEP"
  | "DELETE_STEP"
  | null;

export interface StepProps {
  _id?: string;
  title: string;
  description: string;
  isCompleted?: boolean;
  createdAt?: string;
}

export interface ProjectProps {
  _id?: string;
  title: string;
  description?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
  roadmapId?: string;
  createdAt?: string;
  level:"Beginner"|"Intermediate"|"Advanced"
}

export interface ModalPayload extends ProjectProps {
  stepId?: string;
  stepTitle?: string;
  stepDescription?: string;
}

export interface ActiveProjectModalState {
  type: ProjectModalType;
  payload?: ModalPayload;
}

export interface DeleteStepModalProps {
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export interface AddAndEditProjectModalProps {
  mode: "ADD" | "EDIT";
  payload?: ProjectProps;
  onClose: () => void;
  onSuccess: (project: ProjectProps) => void;
}

export interface AddAndEditStepModalProps {
  mode: "ADD" | "EDIT";
  projectId: string;
  stepId?: string;
  initialTitle?: string;
  initialDescription?: string;
  onClose: () => void;
  onSuccess: (step: StepProps) => void;
}

export interface ProjectActiveModalProps {
  modal: ActiveProjectModalState;
  onClose: () => void;
  setProjects: Dispatch<SetStateAction<ProjectProps[]>>;
  setStepsMap: Dispatch<SetStateAction<Record<string, StepProps[]>>>;
}
