import { resourceProps } from "./api";

export type difficultySectionProps =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  | "Master";
export type rankProps = "Beginner" | "Intermediate" | "Advanced";

export type resourcesTypeSectionProps = "video" | "article" | "course";

export interface roadmapDummyDataProps {
  title: string;
  description: string;
  numberOfSections?: number;
  mode?: "roadmap" | "quiz" | "project";
  id: string;
  difficulty?: difficultySectionProps;
  tags?: string[];
  steps?: { title: string; description: string }[];
  quizTitle?: string;
  quizDescription?: string;
  imageURL?: string;
}

export interface quizProps {
  title: string;
  description: string;
  id?: string;
  _id?: string;
  rank?: difficultySectionProps;
}

export interface sectionDataProps {
  title: string;
  description: string;
  id: string;
  _id?: string;
  roadmapId: string;
  difficulty: difficultySectionProps;
  resources: resourceProps[];
}

export interface projectDummyDataProps {
  title: string;
  description: string;
  tags: string[];
  id: string;
  _id?: string;
  steps: { title: string; description: string }[];
  level: `Beginner` | `Intermediate` | `Advanced`;
}

export interface updateProfileProps {
  username?: string;
  bio?: string;
  email?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "banned";
  joined: string;
}
