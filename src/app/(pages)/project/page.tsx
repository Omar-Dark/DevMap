"use client";

import DropDownMenu from "@/app/components/UI/DropDownMenu";
import { Search, X, Loader2 } from "lucide-react";
import RoadmapItem from "@/app/components/Roadmap/RoadmapItem";
import { difficultySectionProps, projectDummyDataProps } from "@/app/types/roadmap";
import { useEffect, useRef, useState, useCallback } from "react";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import RoadmapItemSkeletonLoading from "@/app/components/Roadmap/RoadmapItemLoading";
import { AxiosError } from "axios";
import NotFoundProject from "@/app/components/Project/NotFoundProject";
import { useDebounce } from "@/app/hooks/useDebounce";

const ProjectPageLayout = () => {
  const [projects, setProjects] = useState<projectDummyDataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<difficultySectionProps | "Select Level">("Select Level");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 1000);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setPage(1); setProjects([]); setHasMore(true); }, [debouncedQuery, selectedLevel]);

  const fetchProjects = useCallback(async (currentPage: number) => {
    if (currentPage === 1) setLoading(true); else setFetchingMore(true);
    try {
      const res = await RoadmapApiAxiosInstance.get(
        apiRoutes.Project.getAllProjects.route({
          page: currentPage,
          q: debouncedQuery,
          level: selectedLevel === "Select Level" ? undefined : selectedLevel,
        })
      );
      if (res.data.success) {
        const newProjects = res.data.projects || [];
        setProjects((prev) => currentPage === 1 ? newProjects : [...prev, ...newProjects]);
        setHasMore(newProjects.length > 0);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.message || "Something went wrong");
      setHasMore(false);
    } finally { setLoading(false); setFetchingMore(false); }
  }, [debouncedQuery, selectedLevel]);

  useEffect(() => { fetchProjects(page); }, [fetchProjects, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !fetchingMore && !loading) setPage((prev) => prev + 1);
      },
      { root: null, rootMargin: "400px", threshold: 0.1 }
    );
    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [hasMore, fetchingMore, loading]);

  const clearFilters = () => { setQuery(""); setSelectedLevel("Select Level"); };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wide">Projects</p>
          <h1 className="text-3xl font-bold text-foreground">Project Ideas</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl">
            Practice your skills with real-world projects. Each project includes detailed steps, requirements, and expected deliverables.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={13} />
              </button>
            )}
          </div>
          <DropDownMenu
            onChange={(value) => setSelectedLevel(value as difficultySectionProps)}
            option={selectedLevel}
            optionList={["Beginner", "Intermediate", "Advanced"]}
          />
          {(query || selectedLevel !== "Select Level") && (
            <button onClick={clearFilters} className="text-xs text-primary hover:underline">
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <RoadmapItemSkeletonLoading length={9} />
        ) : projects.length === 0 ? (
          <NotFoundProject
            message="No projects found matching your criteria. Try adjusting your search or filters."
            clearFilters={clearFilters}
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <RoadmapItem
                  key={project._id}
                  description={project.description}
                  id={project._id!}
                  title={project.title}
                  difficulty={project.level as difficultySectionProps}
                  tags={project.tags}
                  mode="project"
                  steps={project.steps}
                />
              ))}
            </div>
            <div ref={observerRef} className="h-20 flex items-center justify-center mt-8">
              {fetchingMore && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              {!hasMore && !fetchingMore && (
                <p className="text-muted-foreground text-sm">You&apos;ve reached the end 🎉</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectPageLayout;
