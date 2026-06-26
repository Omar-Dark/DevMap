"use client";

const QuizDetailsLoading = ({ length = 5 }: { length?: 5 }) => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Header card */}
        <div className="devmap-card mb-6 space-y-4">
          <div className="h-7 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-2 w-full rounded-full bg-muted mt-4" />
        </div>

        {/* Question skeletons */}
        <div className="space-y-4 mb-6">
          {Array.from({ length }).map((_, i) => (
            <div key={i} className="devmap-card space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
                <div className="h-5 w-3/4 rounded bg-muted" />
              </div>
              <div className="space-y-2 ml-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-11 w-full rounded-xl bg-muted" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="devmap-card flex items-center justify-between">
          <div className="h-10 w-28 rounded-xl bg-muted" />
          <div className="h-10 w-36 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default QuizDetailsLoading;
