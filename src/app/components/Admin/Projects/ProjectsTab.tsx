"use client";

import { useEffect, useState, useCallback } from "react";
import { FaPlus, FaRegFileAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import QuizTabLoading from "../Quizzes/QuizTabLoading";
import { difficultyStyle } from "../../Roadmap/RoadmapItem";
import {
  ActiveProjectModalState,
  ModalPayload,
  ProjectModalType,
  ProjectProps,
  StepProps,
} from "@/app/types/admin";
import ProjectActiveModal from "./ProjectActiveModal";
import ProjectNotFound from "./ProjectNotFound";

const ProjectsTab = () => {
  const [projects, setProjects] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [openProject, setOpenProject] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [stepsMap, setStepsMap] = useState<Record<string, StepProps[]>>({});

  const [activeModal, setActiveModal] = useState<ActiveProjectModalState>({
    type: null,
  });

  const fetchProjects = useCallback(async (currentPage: number) => {
    if (currentPage === 1) {
      setLoading(true);
    } else {
      setFetchingMore(true);
    }

    try {
      const res = await RoadmapApiAxiosInstance.get(
        apiRoutes.Project.getAllProjects.route({ page: currentPage })
      );

      if (res.data.success) {
        const newProjects = res.data.projects || [];

        setProjects((prev) =>
          currentPage === 1 ? newProjects : [...prev, ...newProjects]
        );

        // Stop fetching more if no projects returned
        setHasMore(newProjects.length > 0);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.message ?? "Something went wrong");
      setHasMore(false); 
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, []);


  useEffect(() => {
    fetchProjects(page);
  }, [fetchProjects, page]);

  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 250 &&
        hasMore &&
        !fetchingMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, fetchingMore, loading]);

  const handleOpenProject = async (isOpen: boolean, project: ProjectProps) => {
    const projectId = project._id ?? "";
    setOpenProject(isOpen ? null : projectId);

    if (isOpen || !projectId) return;

    setLoadingSteps(true);
    try {
      const res = await RoadmapApiAxiosInstance.get(
        apiRoutes.Steps.getAllSteps.route(projectId)
      );

      if (res.data.success) {
        setStepsMap((prev) => ({
          ...prev,
          [projectId]: res.data.steps || [],
        }));
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 404) {
        setStepsMap((prev) => ({ ...prev, [projectId]: [] }));
      } else {
        toast.error(axiosError.message ?? "Something went wrong");
      }
    } finally {
      setLoadingSteps(false);
    }
  };

  const toggleModal = (
    e: React.MouseEvent,
    payload?: ModalPayload,
    type?: ProjectModalType
  ) => {
    e.stopPropagation();
    setActiveModal({ type: type ?? null, payload });
  };

  if (loading && page === 1) return <QuizTabLoading />;

  return (
    <>
      <div className="space-y-6 my-10">
        <div className="flex justify-between items-center">
          <h4 className="sm:text-xl text-lg font-bold">
            Projects ({projects.length})
          </h4>
          <button
            onClick={(e) => toggleModal(e, undefined, "ADD_PROJECT")}
            className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <FaPlus /> New Project
          </button>
        </div>

        {projects.map((project) => {
          const isOpen = openProject === project._id;
          const steps = stepsMap[project._id ?? ""] ?? [];

          return (
            <motion.div
              key={project._id}
              layout
              className="rounded-2xl transition-all border bg-card text-card-foreground shadow-sm border-border"
            >
              <div
                className="flex sm:items-center justify-between p-5 cursor-pointer flex-col sm:flex-row items-end gap-4"
                onClick={() => handleOpenProject(isOpen, project)}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronRight size={25} />
                  </motion.div>

                  <div>
                    <h3 className="font-semibold text-base sm:text-xl hover:text-primary transition">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${difficultyStyle(
                          project?.difficulty ?? "Beginner"
                        )}`}
                      >
                        {project?.difficulty ?? "Beginner"}
                      </span>
                      {(project.tags?.length ?? 0) > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {project.tags?.length} tag
                          {project.tags!.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                  <FiEdit2
                    size={27}
                    onClick={(e) => toggleModal(e, project, "EDIT_PROJECT")}
                    className="hover:text-primary cursor-pointer rounded-lg hover:bg-primary/20 p-1 transition-all"
                  />
                  <FiTrash2
                    size={27}
                    onClick={(e) => toggleModal(e, project, "DELETE_PROJECT")}
                    className="hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/20 p-1 transition-all"
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key={`project-content-${project._id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="px-5 pb-5 space-y-5">
                      {project.description && (
                        <p className="text-sm text-muted-foreground pt-4">
                          {project.description}
                        </p>
                      )}

                      {(project.tags?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="bg-primary/10 text-primary border border-primary/30 rounded-full px-3 py-1 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {loadingSteps ? (
                        <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin mx-auto my-5 text-primary" />
                      ) : (
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">
                            Steps ({steps.length})
                          </h4>
                          <button
                            onClick={(e) =>
                              toggleModal(e, { ...project }, "ADD_STEP")
                            }
                            className="flex items-center gap-2 cursor-pointer border-border text-sm px-3 py-1.5 rounded-lg border hover:bg-muted transition"
                          >
                            <FiPlus size={14} /> Add Step
                          </button>
                        </div>
                      )}

                      <div className="space-y-2">
                        {steps.map((step) => (
                          <motion.div
                            key={step._id}
                            className="flex justify-between items-start p-3 rounded-lg bg-card border border-border flex-col sm:flex-row gap-3"
                          >
                            <div className="flex items-start gap-3 text-sm flex-1 min-w-0">
                              <FaRegFileAlt className="text-primary mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium">{step.title}</p>
                                {step.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                    {step.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {projects.length === 0 && !loading && <ProjectNotFound toggleModal={toggleModal} />}

        {fetchingMore && (
          <div className="flex justify-center py-6">
            <AiOutlineLoading3Quarters
              className="animate-spin text-primary"
              size={25}
            />
          </div>
        )}

        {!hasMore && projects.length > 0 && (
          <p className="text-center text-muted-foreground text-sm py-6">
            You&apos;ve reached the end 🎉
          </p>
        )}
      </div>

      <ProjectActiveModal
        modal={activeModal}
        onClose={() => setActiveModal({ type: null })}
        setProjects={setProjects}
        setStepsMap={setStepsMap}
      />
    </>
  );
};

export default ProjectsTab;