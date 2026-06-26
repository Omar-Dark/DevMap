import { MdQuiz } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { NotFoundQuestionsProps } from "@/app/types/UI";



const NotFoundQuestions = ({ onAddQuestion }: NotFoundQuestionsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
      <MdQuiz className="text-primary" size={55} />

      <div className="space-y-1">
        <h4 className="text-lg font-semibold">No Questions Yet</h4>
        <p className="text-sm text-muted-foreground">
          This quiz doesn&apos;t have any questions yet.
        </p>
      </div>

      <button
        onClick={onAddQuestion}
        className="flex items-center gap-2 border-border text-sm px-3 py-1.5 cursor-pointer rounded-lg border hover:bg-muted transition"
      >
        <FiPlus size={14}  />
        Add First Question
      </button>
    </div>
  );
};

export default NotFoundQuestions;
