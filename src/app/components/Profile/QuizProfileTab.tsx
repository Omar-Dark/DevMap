import { quizRoadmapProgressDataProps } from "@/app/types/api";
import { getProgressTitle } from "@/app/helper";
import EmptyTab from "./EmptyTab";

const QuizProfileTab = ({ quiz }: { quiz: quizRoadmapProgressDataProps[] }) => {
  if (quiz.length === 0) return <EmptyTab linkUrl="quiz" message="No quizzes completed yet. Start a quiz to track your progress!" />;
  return (
    <div className="space-y-3">
      {quiz.map((quizItem, i) => {
        // quiz field may be a populated object or a string ID
        const title = getProgressTitle(quizItem.quiz);
        const isPassed = quizItem.status === "Pass" || quizItem.status === "Passed";
        return (
          <div key={i} className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 p-4 rounded-xl border border-border bg-muted/40 hover:border-primary/30 transition-colors">
            <div className="space-y-0.5 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">
                {title || `Quiz #${quizItem._id?.slice(-6)}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {quizItem.totalQuestions} Questions • {quizItem.correctAnswers} Correct • {quizItem.wrongAnswers} Wrong
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-lg font-bold text-foreground">{quizItem.percentage}%</span>
              <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                isPassed
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {quizItem.grade}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizProfileTab;
