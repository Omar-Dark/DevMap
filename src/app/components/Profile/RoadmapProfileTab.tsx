import { roadmapProgressDataProps } from "@/app/types/api";
import EmptyTab from "./EmptyTab";

// Safely extract title from populated roadmap object or return empty for raw IDs
const getRoadmapTitle = (field: any): string => {
  if (!field) return "";
  if (typeof field === "string") return ""; // raw MongoDB ID — no title available
  if (typeof field === "object" && field.title) return field.title;
  return "";
};

const RoadmapProfileTab = ({ roadmap }: { roadmap: roadmapProgressDataProps[] }) => {
  if (roadmap.length === 0) return <EmptyTab linkUrl="roadmap" message="No roadmaps started yet. Explore our learning paths!" />;
  return (
    <div className="space-y-3">
      {roadmap.map((roadmapItem, i) => {
        const val = roadmapItem.numberOfAllSections;
        const totalSections = (() => {
          if (typeof val === "number") return val;
          if (Array.isArray(val)) {
            const first = val[0];
            return typeof first === "number" ? first : val.length;
          }
          return 0;
        })();
        const pct = totalSections
          ? Math.round((roadmapItem.completedSections.length / totalSections) * 100)
          : 0;
        // Safe: API may return string ID or populated {_id, title} object
        const title = getRoadmapTitle(roadmapItem.roadmap) || `Roadmap #${i + 1}`;
        return (
          <div key={i} className="p-4 rounded-xl border border-border bg-muted/40 hover:border-primary/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-foreground">{title}</p>
              <span className="text-xs font-bold text-primary">{pct}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {roadmapItem.completedSections.length} / {totalSections} sections completed
            </p>            <div className="devmap-progress">
              <div className="devmap-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoadmapProfileTab;
