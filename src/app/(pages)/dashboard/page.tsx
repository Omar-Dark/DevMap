"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { UserProps } from "@/app/types/api";
import UnauthorizedPage from "@/app/components/Auth/UnauthorizedPage";
import toast from "react-hot-toast";
import { getProgressTitle } from "@/app/helper";
import { getStreak } from "@/app/components/Auth/AuthInitializer";
import {
  Flame,
  ArrowRight,
  Sparkles,
  Trophy,
  Lightbulb,
} from "lucide-react";

const Page = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [profile, setProfile] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user && isAuthenticated) {
          const res = await RoadmapApiAxiosInstance.get(apiRoutes.Users.getProfile.route);
          if (res.data?.success) setProfile(res.data.user);
        }
      } catch {
        toast.error("Couldn't load your dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) return <UnauthorizedPage mode="authenticate" />;

  const roadmapProgress = profile?.progressData?.roadmap ?? [];
  const quizProgress   = profile?.progressData?.quiz    ?? [];

  // Overall progress — safe against populated objects and various numberOfAllSections shapes
  const overallPct = (() => {
    if (!roadmapProgress.length) return 0;
    const totals = (roadmapProgress as any[]).map((r) => {
      const val = r.numberOfAllSections;
      let total = 0;
      if (typeof val === "number") total = val;
      else if (Array.isArray(val)) {
        const first = val[0];
        total = typeof first === "number" ? first : val.length;
      }
      return total ? r.completedSections.length / total : 0;
    });
    return Math.round((totals.reduce((a: number, b: number) => a + b, 0) / totals.length) * 100);
  })();

  const completedCount    = roadmapProgress.reduce((acc: number, r: any) => acc + (r.completedSections?.length ?? 0), 0);
  const achievementsCount = quizProgress.filter((q: any) => q.status === "Pass" || q.status === "Passed").length;

  const currentRoadmap  = roadmapProgress[0] as any;

  // numberOfAllSections can be: a number, an array of numbers, or an array of section IDs (strings)
  // We only want a numeric count
  const getRoadmapTotal = (r: any): number => {
    const val = r?.numberOfAllSections;
    if (!val) return 0;
    if (typeof val === "number") return val;
    if (Array.isArray(val)) {
      const first = val[0];
      // If it's a number use it, if it's a string ID the length of array is the count
      return typeof first === "number" ? first : val.length;
    }
    return 0;
  };

  const currentTotal = getRoadmapTotal(currentRoadmap);
  const currentPct   = currentRoadmap && currentTotal
    ? Math.round((currentRoadmap.completedSections.length / currentTotal) * 100) : 0;

  // Safe title extraction — roadmap field is a populated object OR a string ID
  const getRoadmapTitle = (roadmapField: any): string => {
    if (!roadmapField) return "";
    if (typeof roadmapField === "string") return ""; // raw ID — no title available
    if (typeof roadmapField === "object") return roadmapField.title || "";
    return "";
  };

  const currentRoadmapTitle = currentRoadmap
    ? getRoadmapTitle(currentRoadmap.roadmap)
    : "";

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, {profile?.username || user?.username || "there"}!
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your consistency is paying off. Ready for your next challenge?
            </p>
          </div>
          <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl text-sm font-semibold shrink-0">
            <Flame size={15} />
            {getStreak()} Day Streak
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall progress */}
            <div className="devmap-card">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Overall Progress
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-foreground">{overallPct}%</span>
                    <div className="flex-1 devmap-progress">
                      <div className="devmap-progress-fill" style={{ width: `${overallPct}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 shrink-0 sm:border-l sm:border-border sm:pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold text-green-500">{completedCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                    <p className="text-xl font-bold text-primary">
                      {String(achievementsCount).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current roadmap */}
            <div className="devmap-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                  Current Roadmap
                </span>
                <Link href="/roadmap" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ArrowRight size={14} />
                </Link>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {currentRoadmapTitle || "Start a Roadmap"}
              </h2>
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">Overall Progress</p>
                  <span className="text-sm font-medium text-foreground">{currentPct}% Complete</span>
                </div>
                <div className="devmap-progress mb-3">
                  <div className="devmap-progress-fill" style={{ width: `${currentPct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {currentRoadmap
                    ? `${currentRoadmap.completedSections.length} sections completed`
                    : "Enroll in a roadmap to start tracking your progress"}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Link href="/roadmap" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                  Continue Learning <ArrowRight size={14} />
                </Link>
                <Link href="/roadmap" className="text-sm font-medium text-primary hover:underline">
                  View Roadmap Details
                </Link>
              </div>
            </div>

            {/* Recent achievements */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Recent Achievements</h2>
                <Link href="/achievements" className="text-sm font-medium text-primary hover:underline">
                  View All
                </Link>
              </div>
              {quizProgress.length === 0 ? (
                <div className="devmap-card text-center py-8 text-muted-foreground text-sm">
                  No achievements yet — complete a quiz to earn your first badge!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {quizProgress.slice(0, 3).map((q, i) => {
                    // Safe extraction: quiz field may be a populated object or string
                    const quizTitle = getProgressTitle(q.quiz);
                    return (
                      <div key={i} className="devmap-card text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Trophy size={20} className="text-primary" />
                        </div>
                        <p className="font-semibold text-sm text-foreground line-clamp-2">
                          {quizTitle || `Quiz #${q._id?.slice(-4)}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{q.status}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Recommended for You</h2>
              <div className="space-y-3">
                {[
                  { icon: "📘", title: "JavaScript Basics Quiz", sub: "Refresh your core concepts", meta: "5 mins • Beginner",      color: "bg-amber-100 dark:bg-amber-950/30" },
                  { icon: "⚛️", title: "Introduction to React",  sub: "Next big step in Frontend",  meta: "45 mins • Advanced",     color: "bg-blue-100 dark:bg-blue-950/30"  },
                  { icon: "🖼️", title: "Responsive Images",      sub: "Master 'srcset' and 'sizes'",meta: "15 mins • Intermediate", color: "bg-green-100 dark:bg-green-950/30" },
                ].map((item) => (
                  <Link href="/quiz" key={item.title} className="devmap-card flex items-start gap-3 hover:border-primary/30 transition-colors">
                    <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-lg shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground leading-snug">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                      <p className="text-xs text-primary font-medium mt-1">{item.meta}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-foreground text-background p-5 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
              <Lightbulb size={20} className="text-amber-400 mb-3" />
              <h3 className="font-bold text-base mb-2">Learning Tip</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Users who take short quizzes after lessons retain 40% more information. Try one today!
              </p>
              <Link href="/quiz" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                Explore Quizzes <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
