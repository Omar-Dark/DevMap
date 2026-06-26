"use client";

import RoadmapItem from "@/app/components/Roadmap/RoadmapItem";
import { useEffect, useState } from "react";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { roadmapProps } from "@/app/types/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import RoadmapItemSkeletonLoading from "@/app/components/Roadmap/RoadmapItemLoading";
import { Search, SlidersHorizontal, X } from "lucide-react";

const Page = () => {
  const [roadmaps, setRoadmaps] = useState<roadmapProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await RoadmapApiAxiosInstance.get(apiRoutes.Roadmap.getAllRoadmaps.route);
        if (res.data.success) {
          const formatted = res.data?.roadmap?.map((roadmapItem: roadmapProps) => ({
            ...roadmapItem,
            numberOfSections: roadmapItem.sections?.length || 0,
            id: roadmapItem._id,
            imageURL: roadmapItem.imageURL || roadmapItem.image || roadmapItem.thumbnail || "",
          }));
          setRoadmaps(formatted);
        }
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        toast.error(axiosError.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const filtered = roadmaps.filter((r) =>
    !searchQuery || r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs text-primary font-semibold mb-1">Learning Roadmaps</p>
          <h1 className="text-3xl font-bold text-foreground">Learning Roadmaps</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl">
            Choose a structured path to master new skills. From fundamentals to advanced specialized tracks, curated for career growth.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative">
            <select className="appearance-none pl-4 pr-8 py-2 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option>Category: All Fields</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>DevOps</option>
              <option>Design</option>
            </select>
            <SlidersHorizontal size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none pl-4 pr-8 py-2 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option>Difficulty: Any Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <SlidersHorizontal size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roadmaps..."
              className="w-full pl-8 pr-8 py-2 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={13} />
              </button>
            )}
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-xs text-primary hover:underline">
              Clear Filters
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <RoadmapItemSkeletonLoading />
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5">
                Explore All Roadmaps
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((roadmap) => (
                  <RoadmapItem
                    mode="roadmap"
                    title={roadmap.title}
                    description={roadmap.description}
                    numberOfSections={roadmap.numberOfSections}
                    id={roadmap.id}
                    imageURL={roadmap.imageURL}
                    key={roadmap.id}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-3 text-center py-16 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No roadmaps found</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
