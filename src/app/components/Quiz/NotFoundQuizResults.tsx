"use client";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";

const NotFoundQuizResults = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-sm w-full text-center space-y-6 devmap-card">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <ClipboardList size={28} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Quiz Result Not Found</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Quiz results are not available or you haven&apos;t completed this quiz yet.
          </p>
        </div>
        <button
          onClick={() => router.push("/quiz")}
          className="btn-primary w-full py-3 rounded-xl justify-center"
        >
          Browse Quizzes
        </button>
      </div>
    </div>
  );
};

export default NotFoundQuizResults;
