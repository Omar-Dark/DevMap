"use client";
import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { iconDependingOnType, styleDependingOnDifficulty } from "@/app/helper";
import { resourceProps } from "@/app/types/api";
import { RoadmapDetailsSectionsProps } from "@/app/types/UI";
import Link from "next/link";
import toast from "react-hot-toast";
import { ExternalLink, CheckCircle2, Circle } from "lucide-react";

const RoadmapDetailsSections = ({
  isAuthenticated,
  userProgress,
  setUserProgress,
  sectionDetails,
}: RoadmapDetailsSectionsProps) => {
  const toggleCompletionSection = async (index: number, sectionId: string) => {
    setUserProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: (prev.sections ?? []).map((section, i) =>
          i === index ? { ...section, completed: !section.completed } : section
        ),
      };
    });
    const res = await RoadmapApiAxiosInstance.post(
      apiRoutes.Section.toggleCompletionSection.route(userProgress?.roadmap?._id || "1", sectionId)
    );
    if (res.data.success) {
      toast.success(res.data.message);
      setUserProgress((prev) => {
        if (!prev) return prev;
        const updatedSections = [...prev.sections];
        const wasCompleted = updatedSections[index].completed;
        updatedSections[index].completed = !wasCompleted;
        return { ...prev, sections: updatedSections, completed: wasCompleted ? prev.completed! - 1 : prev.completed! + 1 };
      });
    } else {
      toast.error(res.data.message || "Couldn't toggle completion status");
    }
  };

  const renderSection = (section: any, index: number, showToggle = false) => (
    <div
      id={`section-${index}`}
      key={index}
      className={`scroll-mt-24 devmap-card transition-all hover:border-primary/20 ${
        showToggle && section.completed ? "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30" : ""
      }`}
    >
      {/* Section header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          {showToggle && (
            <button
              onClick={() => toggleCompletionSection(index, section._id)}
              className="mt-0.5 text-primary cursor-pointer hover:scale-110 transition-transform shrink-0"
              title={section.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {section.completed ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <Circle size={20} className="text-muted-foreground" />
              )}
            </button>
          )}
          <h2 className={`font-semibold text-sm sm:text-base leading-snug ${showToggle && section.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {section.title}
          </h2>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 font-medium ${styleDependingOnDifficulty(section?.difficulty || "Beginner")}`}>
          {section.difficulty}
        </span>
      </div>

      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 ml-0 sm:ml-7">
        {section.description}
      </p>

      {/* Resources */}
      {section?.resources?.length > 0 && (
        <div className="space-y-1.5 ml-0 sm:ml-7">
          {section.resources.map((resource: resourceProps, i: number) => (
            <Link
              href={resource.url}
              target="_blank"
              key={i}
              className="flex items-center justify-between gap-3 text-sm text-muted-foreground hover:text-primary hover:bg-muted px-3 py-2.5 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-primary shrink-0">{iconDependingOnType(resource.type)}</span>
                <div className="min-w-0">
                  <p className="font-medium text-xs truncate">{resource.title}</p>
                  <p className="text-xs text-muted-foreground/70">{resource.type}</p>
                </div>
              </div>
              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {isAuthenticated
        ? userProgress?.sections.map((section, index) => renderSection(section, index, true))
        : sectionDetails?.map((section, index) => renderSection(section, index, false))}
    </div>
  );
};

export default RoadmapDetailsSections;
