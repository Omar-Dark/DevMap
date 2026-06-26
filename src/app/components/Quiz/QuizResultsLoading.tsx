const QuizResultsLoading = ({ length = 5 }: { length?: number }) => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
        <div className="devmap-card h-32" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="devmap-card h-20" />)}
        </div>
        <div className="devmap-card h-16" />
        <div className="devmap-card space-y-3">
          {Array.from({ length }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted" />)}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsLoading;
