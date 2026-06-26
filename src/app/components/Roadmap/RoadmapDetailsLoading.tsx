"use client";

import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";

const RoadmapDetailsLoading = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* breadcrumb */}
        <div className="h-4 w-48 rounded bg-muted mb-6" />
        <div className={`grid grid-cols-1 gap-6 ${isAuthenticated ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {/* sidebar */}
          <div className="devmap-card space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 rounded-lg bg-muted" />
            ))}
          </div>
          {/* main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="devmap-card space-y-4">
              <div className="h-6 w-1/3 rounded bg-muted" />
              <div className="h-8 w-2/3 rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
              </div>
              <div className="h-10 w-40 rounded-xl bg-muted" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="devmap-card space-y-3">
                <div className="h-5 w-1/2 rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
                <div className="h-2 rounded-full bg-muted" />
              </div>
            ))}
          </div>
          {/* right sidebar */}
          {isAuthenticated && (
            <div className="devmap-card">
              <div className="h-32 w-32 rounded-full bg-muted mx-auto mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-muted mx-auto" />
                <div className="h-4 w-32 rounded bg-muted mx-auto" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetailsLoading;
