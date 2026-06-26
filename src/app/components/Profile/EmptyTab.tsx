import { EmptyTabProps } from "@/app/types/UI";
import Link from "next/link";
import { Inbox } from "lucide-react";

const EmptyTab = ({ message, linkUrl }: EmptyTabProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <Inbox size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      {linkUrl && (
        <Link
          href={`/${linkUrl}`}
          className="btn-secondary text-sm px-4 py-2 rounded-lg"
        >
          Go to {linkUrl[0].toUpperCase() + linkUrl.slice(1)}
        </Link>
      )}
    </div>
  );
};

export default EmptyTab;
