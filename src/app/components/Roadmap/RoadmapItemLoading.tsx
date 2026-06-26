const RoadmapItemSkeletonLoading = ({ length = 9 }: { length?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="devmap-card animate-pulse"
        >
          <div className="h-5 w-3/4 rounded-md bg-muted mb-3" />
          <div className="space-y-2 mb-4">
            <div className="h-3.5 w-full rounded bg-muted" />
            <div className="h-3.5 w-11/12 rounded bg-muted" />
            <div className="h-3.5 w-8/12 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="h-px bg-border mb-4" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="w-8 h-8 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapItemSkeletonLoading;
