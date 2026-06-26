import { NotFoundProjectProps } from "@/app/types/UI";
import { Search, X } from "lucide-react";

const NotFoundProject = ({ message = "not found", clearFilters }: NotFoundProjectProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 devmap-card">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Search size={24} className="text-muted-foreground" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">No Projects Found</h2>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-5">
        {message || "We couldn't find any projects matching your search or selected level. Try adjusting your filters."}
      </p>
      {clearFilters && (
        <button
          onClick={clearFilters}
          className="btn-secondary text-sm px-4 py-2 rounded-lg gap-1.5"
        >
          <X size={13} />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default NotFoundProject;
