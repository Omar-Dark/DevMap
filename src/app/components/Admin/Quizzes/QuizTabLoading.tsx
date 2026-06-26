const QuizTabLoading = ({ length = 5 }: { length?: number }) => {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="rounded-3xl p-6 sm:p-8 shadow-xl border bg-card border-border space-y-6">

          <div className="h-6 sm:h-7 w-40 sm:w-48 animate-pulse rounded-md bg-muted" />

          {Array.from({ length }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-muted/40 p-5 sm:p-6 space-y-4"
            >
              <div className="h-5 w-4/5 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default QuizTabLoading;