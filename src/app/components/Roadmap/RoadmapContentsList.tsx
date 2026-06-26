import { RoadmapContentsListProps } from "@/app/types/UI";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";

const handleScrollToSection = (index: number) => {
  document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const RoadmapContentsList = ({ isAuthenticated, userProgress, sectionDetails }: RoadmapContentsListProps) => {
  const sections = isAuthenticated
    ? userProgress?.sections
    : sectionDetails?.map((s) => ({ title: s.title, completed: false, _id: s._id }));

  return (
    <div className="lg:col-span-1 devmap-card h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Link href="/roadmap" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft size={15} />
        </Link>
        <h3 className="font-semibold text-sm text-foreground">Contents</h3>
      </div>

      <div className="space-y-0.5">
        {sections?.map((section, index) => (
          <button
            key={index}
            onClick={() => handleScrollToSection(index)}
            className="w-full flex items-center gap-2 text-left cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-2 rounded-lg transition-colors group text-xs"
          >
            {isAuthenticated ? (
              section.completed ? (
                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
              ) : (
                <Circle size={12} className="shrink-0 text-muted-foreground/40" />
              )
            ) : (
              <span className="w-3 h-3 rounded-full border border-muted-foreground/30 shrink-0" />
            )}
            <span className="leading-snug line-clamp-2">{section.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoadmapContentsList;
