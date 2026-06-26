import { QuestionItemProps } from "./quiz";
import { difficultySectionProps, resourcesTypeSectionProps } from "./roadmap";
export interface FiltersProps {
  q?: string;
  isAdmin?: boolean;
  page?: number;
  limit?: number;
  level?: difficultySectionProps;
}
export interface QuestionsFilterProps {
  q?: string;
  page?: number;
  limit?: number;
  random?: boolean;
}

export interface UserProps {
  id?: string;
  _id?: string;
  isAdmin: boolean;
  username?: string;
  email?: string;
  imageURL: string;
  createdAt?: Date;
  updatedAt?:Date
  bio?: string;
  progressData: {
    project: projectProgressDataProps[];
    roadmap: roadmapProgressDataProps[];
    quiz: quizRoadmapProgressDataProps[];
  };
}

export interface UserStateProps {
  user: UserProps | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface roadmapProgressDataProps {
  roadmap: string | {
    _id: string;
    title: string;
    description?: string;
    imageURL?: string;
    image?: string;
    thumbnail?: string;
    badge?: { _id?: string; title?: string; imageURL?: string; image?: string } | null;
  };
  completedSections: string[];
  numberOfAllSections: number[];
  completed?: boolean;
}

// The API populates quiz/roadmap/project with the full document, not just an ID
// The type says string but runtime returns an object — handle both safely
export interface quizProgressObject {
  _id: string;
  title: string;
  rank?: string;
  questions?: unknown[];
}

export interface quizRoadmapProgressDataProps {
  quiz: string | quizProgressObject;
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  _id: string;
  wrongAnswers: number;
  grade: string;
  status: string;
  createdAt: Date;
}

export interface projectProgressDataProps {
  project: string | { _id: string; title: string };
  completedSteps: string[];
  totalSteps: number;
  completedCount: number;
  createdAt: Date;
}


export interface changePasswordProps {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface resourceProps {
  id: string;
  _id?: string;
  url: string;
  type: resourcesTypeSectionProps;
  title: string;
}

export interface sectionProps {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  difficulty?: difficultySectionProps;
  resources: resourceProps[];
}

export interface roadmapProps {
  title: string;
  description: string;
  numberOfSections?: number;
  id: string;
  sections: sectionProps[] | string[];
  _id?: string;
  imageURL?: string;
  image?: string;
  thumbnail?: string;
  // The API now returns the related quiz and project directly embedded in the roadmap
  quiz?: { _id: string; title: string; description?: string } | null;
  project?: { _id: string; title: string; description?: string } | null;
}

export interface userProgressProps {
  total?: number;
  completed?: number;
  progressPercentage?: number;
  roadmap: roadmapProps;
  sections: sectionProps[];
}

export interface QuestionProps {
  totalQuestions: number;
  questions: QuestionItemProps[];
  totalPages: number;
  page: number;
}
export type QuizGradeProps = "A+" | "A" | "B" | "C" | "D" | "F";
export type StatusGradeProps = "Failed" | "Passed";

export interface answerDetailsProps {
  correctAnswer: string;
  isCorrect: boolean;
  question: string;
  questionId: string;
  userAnswer: string;
}
export interface quizResultsProps {
  quizId?: string;
  quizTitle: string;
  status: StatusGradeProps;
  grade: QuizGradeProps;
  percentage: number;
  totalQuestions: number;
  wrongAnswers: number;
  correctAnswers: number;
  answerDetails: answerDetailsProps[];
  roadmapId?: string | null;
  minPassPct?: number;
}

export interface UsersProps {
  totalPages: number;
  page?:number
  totalUsers: number;
  users: UserProps[];
}

