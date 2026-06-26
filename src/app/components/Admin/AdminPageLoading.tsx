const AdminPageLoading = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="h-4 w-56 rounded bg-muted" />
          </div>
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-lg bg-card" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="devmap-card h-16" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPageLoading;
