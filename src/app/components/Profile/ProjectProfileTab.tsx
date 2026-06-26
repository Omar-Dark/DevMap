"use client";
import { projectProgressDataProps } from "@/app/types/api";
import { getProgressTitle, getProgressId } from "@/app/helper";
import EmptyTab from "./EmptyTab";

const ProjectProfileTab = ({ project }: { project: projectProgressDataProps[] }) => {
  if (project.length === 0) return <EmptyTab linkUrl="project" message="No projects started yet. Pick a project to build your portfolio!" />;
  return (
    <div className="space-y-3">
      {project.map((projectItem, i) => {
        const pct = projectItem.totalSteps
          ? Math.round((projectItem.completedCount / projectItem.totalSteps) * 100)
          : 0;
        // Safe: project field may be populated object or string ID
        const title = getProgressTitle(projectItem.project) || `Project #${i + 1}`;
        const key   = getProgressId(projectItem.project) || String(i);
        return (
          <div key={key} className="p-4 rounded-xl border border-border bg-muted/40 hover:border-primary/30 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-foreground">{title}</p>
              <span className="text-xs font-bold text-primary">{pct}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {projectItem.completedCount} / {projectItem.totalSteps} steps completed
            </p>
            <div className="devmap-progress">
              <div className="devmap-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectProfileTab;
