"use client";
import { roadmapDummyDataProps } from "@/app/types/roadmap";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { difficultySectionProps } from "@/app/types/roadmap";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export const difficultyStyle = (difficulty: difficultySectionProps) => {
  switch (difficulty) {
    case "Beginner":     return "badge-beginner";
    case "Intermediate": return "badge-intermediate";
    case "Advanced":     return "badge-advanced";
    case "Expert":       return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "Master":       return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default:             return "bg-muted text-muted-foreground";
  }
};

const RoadmapItem = ({
  title,
  description,
  id,
  numberOfSections,
  difficulty,
  mode = "roadmap",
  tags,
  steps,
  quizDescription,
  quizTitle,
  imageURL,
}: roadmapDummyDataProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const itemLink = isAuthenticated
    ? `/${mode === "roadmap" ? "roadmap" : mode === "quiz" ? "quiz" : "project"}/${id}`
    : mode === "roadmap"
    ? `/roadmap/${id}`
    : mode === "project"
    ? `/project/${id}`
    : `/auth`;

  const ctaLabel =
    mode === "roadmap" ? "View Details" : mode === "quiz" ? "Start Quiz" : "Start Project";

  return (
    <div className="group devmap-card hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col p-0 overflow-hidden">
      {/* Image banner — shown for roadmaps when imageURL is provided */}
      {imageURL && mode === "roadmap" && (
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted">
          <Image
            src={imageURL}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Difficulty badge over image */}
          {difficulty && (
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${difficultyStyle(difficulty)}`}>
                {difficulty}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 p-4">
        {/* Difficulty badge when no image */}
        {difficulty && mode !== "roadmap" && !imageURL && (
          <div className="mb-3">
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyStyle(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* Meta row */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {mode === "roadmap" && numberOfSections !== undefined && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {numberOfSections} sections
            </span>
          )}
          {mode === "project" && tags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full text-xs">
                  <Tag size={9} />
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {mode === "project" && steps && (
            <span>{steps.length} steps</span>
          )}
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-border" />

        {/* CTA */}
        <Link
          href={{
            pathname: itemLink,
            query:
              isAuthenticated && mode === "quiz"
                ? { quizDescription, quizTitle }
                : undefined,
          }}
          className="flex items-center justify-between text-sm font-semibold text-primary group-hover:gap-2 transition-all"
        >
          <span>{ctaLabel}</span>
          <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RoadmapItem;
