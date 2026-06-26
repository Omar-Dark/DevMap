export interface QuestionItemProps {
  question?: string;
  quizId?:string
  _id?:string
  answers?: string[];
  answer?: string;
  options?: string[];
  questionNumber: number;
  selectedAnswer?: string;
  onSelectAnswer: (questionId: string, answer: string) => void;
  userAnswer?:string
}

export type tabsTypesProps = "Quizzes" | "Roadmaps" | "Projects";
