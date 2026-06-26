"use client";

import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import CongratsProjectMessageModal from "@/app/components/Project/CongratsProjectMessageModal";
import ProjectDetailsLoading from "@/app/components/Project/ProjectDetailsLoading";
import { difficultyStyle } from "@/app/components/Roadmap/RoadmapItem";
import ExportBTN from "@/app/components/UI/ExportBTN";
import Modal from "@/app/components/UI/Modal";
import { exportHelper } from "@/app/helper";
import { RootState } from "@/app/redux/store";
import { projectDummyDataProps } from "@/app/types/roadmap";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { CheckCircle2, Circle, Code2, Tag, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const { projectId } = useParams();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [project, setProject] = useState<projectDummyDataProps | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);

  const isProjectCompleted = useMemo(() => {
    return project && completedSteps.filter(Boolean).length === project.steps.length;
  }, [completedSteps, project]);

  const progress = useMemo(() => {
    const completed = completedSteps.filter(Boolean).length;
    return (completed / (project?.steps.length || 0)) * 100;
  }, [completedSteps, project]);

  const toggleIsCompleted = (index: number) => {
    const updated = [...completedSteps];
    updated[index] = !updated[index];
    setCompletedSteps(updated);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await RoadmapApiAxiosInstance.get(apiRoutes.Project.getProjectById.route(String(projectId)));
        if (res.data.success) {
          setProject(res.data.project);
          setCompletedSteps(res.data.project.steps.map(() => false));
        }
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        toast.error(axiosError.response?.data?.message || "Something went wrong");
      } finally { setLoading(false); }
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const storageKey = `project-${projectId}-completed`;
    const alreadyShown = localStorage.getItem(storageKey);
    if (isProjectCompleted && !alreadyShown) {
      setIsCongratsOpen(true);
      localStorage.setItem(storageKey, "true");
    }
  }, [isProjectCompleted, projectId]);

  if (loading) return <ProjectDetailsLoading />;

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/project" className="hover:text-primary transition-colors">Projects</Link>
            <ChevronRight size={12} />
            <span className="text-primary font-medium truncate">{project?.title}</span>
          </nav>

          {/* Header card */}
          <div className="devmap-card">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {project?.title}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project?.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {project?.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                      <Tag size={9} />
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                    <Code2 size={12} />
                    {project?.steps.length} steps
                  </span>
                </div>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${difficultyStyle(project?.level || "Beginner")}`}>
                {project?.level}
              </span>
            </div>

            {isAuthenticated && (
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {completedSteps.filter(Boolean).length} / {project?.steps.length} steps
                  </span>
                </div>
                <div className="devmap-progress">
                  <div className="devmap-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <div className="devmap-card flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">Export Project</p>
              <p className="text-xs text-muted-foreground mt-0.5">Download this project and its steps in your preferred format.</p>
            </div>
            <ExportBTN
              id={String(projectId) ?? ""}
              title={project?.title ?? ""}
              exportToCSV={() => exportHelper(String(projectId) ?? "", project?.title ?? "", "csv", "project")}
              exportToJSON={() => exportHelper(String(projectId) ?? "", project?.title ?? "", "json", "project")}
              exportToPDF={() => exportHelper(String(projectId) ?? "", project?.title ?? "", "pdf", "project")}
            />
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Project Steps</h2>
            <div className="space-y-3">
              {project?.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => isAuthenticated && toggleIsCompleted(i)}
                  className={`w-full text-left devmap-card transition-all hover:border-primary/30 cursor-pointer group ${
                    completedSteps[i] ? "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {isAuthenticated ? (
                      completedSteps[i] ? (
                        <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <Circle size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5 shrink-0" />
                      )
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {i + 1}
                      </div>
                    )}
                    <div>
                      <h5 className={`font-semibold text-sm leading-snug ${completedSteps[i] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        Step {i + 1}: {step.title}
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{step.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground pb-2">© 2026 DevMap Professional Learning Systems. All rights reserved.</p>
        </div>
      </div>

      <Modal isOpen={isCongratsOpen} onClose={() => setIsCongratsOpen(false)} title="Congratulations!">
        <CongratsProjectMessageModal />
      </Modal>
    </>
  );
};

export default Page;
