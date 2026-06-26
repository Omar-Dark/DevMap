"use client";

const ProjectDetailsLoading = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="px-6 py-8 max-w-4xl mx-auto space-y-5">
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="devmap-card space-y-4">
          <div className="h-7 w-2/3 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-6 w-16 rounded-full bg-muted" />)}
          </div>
        </div>
        <div className="devmap-card h-16" />
        <div className="space-y-3">
          <div className="h-5 w-32 rounded bg-muted" />
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="devmap-card h-20" />)}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsLoading;
