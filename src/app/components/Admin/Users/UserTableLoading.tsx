"use client";

const UsersTableLoading = ({ rows = 6 }: { rows?: number }) => {
  return (
    <div className="min-w-225 w-full mt-15">
      <div className="grid grid-cols-5 pb-3 px-3 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-20 bg-muted rounded-md animate-pulse" />
        ))}
      </div>

      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-5 items-center px-3 py-4 border-b border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
          </div>

          <div className="hidden sm:block">
            <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
          </div>

          <div>
            <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
          </div>

          <div className="hidden md:block">
            <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
          </div>

          <div className="flex justify-end">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersTableLoading;
