const ProfileDetailsLoading = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
        {/* Hero card skeleton */}
        <div className="devmap-card">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-4 w-64 rounded bg-muted" />
            </div>
          </div>
        </div>
        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="devmap-card space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted" />
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-12 rounded-xl bg-muted" />
            <div className="devmap-card space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsLoading;
