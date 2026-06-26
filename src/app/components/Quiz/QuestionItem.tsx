"use client";

import { QuestionItemProps } from "@/app/types/quiz";
import { Circle, CheckCircle2 } from "lucide-react";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

const QuestionItem = ({
  question,
  _id,
  answers,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}: QuestionItemProps) => {
  return (
    <div className="devmap-card">
      {/* Question header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
          {questionNumber}
        </div>
        <h4 className="text-sm sm:text-base font-semibold text-foreground leading-relaxed pt-1">
          {question}
        </h4>
      </div>

      {/* Answer options */}
      <div className="space-y-2 ml-1">
        {answers?.map((answer, idx) => {
          const isSelected = selectedAnswer === answer;
          return (
            <button
              key={answer}
              onClick={() => onSelectAnswer(_id!, answer)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
              }`}
            >
              {/* Letter circle */}
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}>
                {OPTION_LABELS[idx] || idx + 1}
              </div>
              <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                {answer}
              </span>
              {isSelected && <CheckCircle2 size={15} className="text-primary ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionItem;
