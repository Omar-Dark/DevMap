"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import ProfileDetailsLoading from "@/app/components/Profile/ProfileDetailsLoading";
import Image from "next/image";
import { getProgressTitle, getProgressId } from "@/app/helper";
import { getStreak } from "@/app/components/Auth/AuthInitializer";
import UnauthorizedPage from "@/app/components/Auth/UnauthorizedPage";
import {
  Flame, Zap, Trophy, Grid3x3, Braces, Terminal,
  ChevronRight, CheckCircle2, Sparkles, BookOpen, Award,
} from "lucide-react";
import Link from "next/link";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const TOP_BADGE_DEFS = [
  { icon: Grid3x3,  label: "Grid Master",    desc: "Mastered CSS Grid layouts",       color: "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" },
  { icon: Braces,   label: "HTML Architect", desc: "100% semantic score on projects", color: "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400" },
  { icon: Terminal, label: "CLI Ninja",      desc: "Advanced terminal usage",          color: "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400" },
];

export default function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user && isAuthenticated) {
          const res = await RoadmapApiAxiosInstance.get(apiRoutes.Users.getProfile.route);
          if (res.data?.success) setProfile(res.data.user);
          else toast.error(res.data?.message);
        }
      } finally { setLoading(false); }
    };
    load();
  }, [user, isAuthenticated]);

  if (loading) return <ProfileDetailsLoading />;
  if (!isAuthenticated) return <UnauthorizedPage mode="authenticate" />;

  const roadmapProgress = profile?.progressData?.roadmap ?? [];
  const quizProgress    = profile?.progressData?.quiz    ?? [];
  const passedCount     = quizProgress.filter((q: any) => q.status === "Pass" || q.status === "Passed").length;
  const streakDays      = getStreak();
  const xp              = passedCount * 850 + 1200;
  const rank            = Math.max(1, 50 - passedCount * 3);

  // Get real badge images from completed roadmaps
  const earnedBadges = roadmapProgress
    .filter((r: any) => {
      const total = Array.isArray(r.numberOfAllSections) ? (r.numberOfAllSections[0] ?? 0) : 0;
      return total > 0 && r.completedSections.length >= total;
    })
    .slice(0, 3)
    .map((r: any) => {
      const roadmapObj = typeof r.roadmap === "object" ? r.roadmap : null;
      const badge = roadmapObj?.badge ?? null;
      return {
        id:       getProgressId(r.roadmap),
        label:    badge?.title || `${getProgressTitle(r.roadmap)} Badge`,
        desc:     `Completed ${getProgressTitle(r.roadmap)}`,
        imageURL: badge?.imageURL || badge?.image || null,
        icon:     Award,
        color:    "bg-primary/10 text-primary",
      };
    });

  // Merge earned badges with fallback static ones
  const topBadges = earnedBadges.length > 0
    ? earnedBadges
    : TOP_BADGE_DEFS;

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-primary font-medium">Profile</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Main column ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero card */}
            <div className="devmap-card">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-primary">
                    <Image
                      src={profile?.imageURL || DEFAULT_AVATAR}
                      alt={profile?.username || "Profile"}
                      width={96} height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground">{profile?.username || "Alex Dev"}</h1>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-lg">
                    {profile?.bio || "No Bio Yet"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
                      <Flame size={12} /> {streakDays} {streakDays === 1 ? "day" : "days"} streak
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                      <Zap size={12} /> {xp.toLocaleString()} XP
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                      <Trophy size={12} /> Rank #{rank}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Roadmaps */}
            <div className="devmap-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Active Roadmaps</h2>
                <Link href="/roadmap" className="text-sm font-medium text-primary hover:underline">View All</Link>
              </div>
              {roadmapProgress.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active roadmaps yet.</p>
                  <Link href="/roadmap" className="btn-primary text-xs px-4 py-2 rounded-lg mt-3 inline-flex">
                    Browse Roadmaps
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {roadmapProgress.slice(0, 2).map((r: any, i: number) => {
                    const total     = Array.isArray(r.numberOfAllSections) ? (r.numberOfAllSections[0] ?? 0) : (r.numberOfAllSections ?? 0);
                    const pct       = total ? Math.round((r.completedSections.length / total) * 100) : 0;
                    // Fix #3 — safely extract title from populated object OR string
                    const title     = getProgressTitle(r.roadmap) || `Roadmap #${i + 1}`;
                    // Get roadmap image if available
                    const roadmapObj= typeof r.roadmap === "object" ? r.roadmap : null;
                    const imageURL  = roadmapObj?.imageURL || roadmapObj?.image || null;
                    const statusColors = ["text-green-500 bg-green-100 dark:bg-green-950/30","text-amber-500 bg-amber-100 dark:bg-amber-950/30"];
                    const statuses     = ["On Track","Picking Up Speed"];
                    const labels       = ["HTML","JS","CSS","PY","RX"];
                    return (
                      <div key={i} className="rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors">
                        {/* Roadmap image if available */}
                        {imageURL && (
                          <div className="h-24 bg-muted relative overflow-hidden">
                            <Image src={imageURL} alt={title} fill sizes="300px" className="object-cover" />
                          </div>
                        )}
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                              {labels[i] || "DEV"}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[i % 2]}`}>
                              {statuses[i % 2]}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">{title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {roadmapObj?.description || "Core technologies and UI principles."}
                            </p>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{pct}% Complete</span>
                              <span className="text-muted-foreground">{r.completedSections.length} / {total} Sections</span>
                            </div>
                            <div className="devmap-progress">
                              <div className="devmap-progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <Link href="/roadmap" className="btn-secondary w-full justify-center text-xs py-2 rounded-lg">
                            Continue Learning
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About */}
            <div className="devmap-card">
              <h2 className="text-lg font-bold text-foreground mb-3">
                About {profile?.username?.split(" ")[0] || "You"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile?.bio || "No bio yet. Visit Settings to add one."}
              </p>
            </div>
          </div>

          {/* ── Right sidebar ───────────────────────────────────── */}
          <div className="space-y-5">
            {/* AI Insight */}
            <div className="rounded-2xl bg-primary p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={15} className="text-white/80" />
                <span className="text-xs font-bold uppercase tracking-wide text-white/80">AI Insight</span>
              </div>
              <p className="text-sm leading-relaxed mb-4 text-white/90">
                &ldquo;You&apos;re excelling in your current roadmap! Consider tackling an Advanced milestone to bridge your CSS skills.&rdquo;
              </p>
              <button className="w-full bg-white text-primary text-xs font-semibold py-2.5 rounded-xl hover:bg-white/90 transition-colors">
                View Recommendations
              </button>
            </div>

            {/* Top Badges */}
            <div className="devmap-card">
              <h3 className="font-bold text-foreground mb-3">Top Badges</h3>
              {topBadges.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Complete a roadmap to earn badges.
                </p>
              ) : (
                <div className="space-y-3">
                  {topBadges.map((badge: any, i: number) => {
                    const Icon = badge.icon;
                    return (
                      <div key={badge.id || i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${badge.color || "bg-primary/10 text-primary"}`}>
                          {badge.imageURL ? (
                            <Image src={badge.imageURL} alt={badge.label} width={36} height={36} className="w-full h-full object-cover" />
                          ) : (
                            <Icon size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{badge.label}</p>
                          <p className="text-xs text-muted-foreground">{badge.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
