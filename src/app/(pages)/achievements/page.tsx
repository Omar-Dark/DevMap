"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { UserProps } from "@/app/types/api";
import UnauthorizedPage from "@/app/components/Auth/UnauthorizedPage";
import { getProgressTitle, getProgressId } from "@/app/helper";
import { getStreak } from "@/app/components/Auth/AuthInitializer";
import {
  Award, Trophy, Flame, Lock, CheckCircle2,
  TrendingUp, ChevronUp, Zap, Sparkles,
} from "lucide-react";

const ACHIEVEMENT_DEFS = [
  { key: "fast-learner",   label: "Fast Learner",         desc: "Complete 5 lessons in a single day.",   icon: Zap,      target: 5  },
  { key: "community",      label: "Community Helper",     desc: "Help 10 users by answering questions.", icon: Trophy,   target: 10 },
  { key: "problem-solver", label: "Master Problem Solver",desc: "Solve 20 high-difficulty challenges.",  icon: Sparkles, target: 20 },
];

export default function AchievementsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [profile,  setProfile]  = useState<UserProps | null>(null);
  const [loading,  setLoading]  = useState(true);
  const streakDays = getStreak();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) { setLoading(false); return; }
      try {
        const res = await RoadmapApiAxiosInstance.get(apiRoutes.Users.getProfile.route);
        if (res.data?.success) setProfile(res.data.user);
      } catch { /* non-critical */ } finally { setLoading(false); }
    };
    fetchProfile();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return <UnauthorizedPage mode="authenticate" />;

  const quizProgress    = profile?.progressData?.quiz    ?? [];
  const roadmapProgress = profile?.progressData?.roadmap ?? [];
  const passedCount     = quizProgress.filter((q) => q.status === "Pass" || q.status === "Passed").length;

  const getSafeTotal = (r: any): number => {
    const val = r?.numberOfAllSections;
    if (typeof val === "number") return val;
    if (Array.isArray(val)) {
      const first = val[0];
      return typeof first === "number" ? first : val.length;
    }
    return 0;
  };

  const getRoadmapTitle = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return "";
    if (typeof field === "object" && field.title) return field.title;
    return "";
  };

  // ── Build badge list from roadmap progress ─────────────────────
  const earnedBadges = roadmapProgress
    .filter((r: any) => {
      const total = getSafeTotal(r);
      return total > 0 && r.completedSections.length >= total;
    })
    .map((r: any) => {
      const roadmapObj = typeof r.roadmap === "object" ? r.roadmap : null;
      const badge      = roadmapObj?.badge ?? null;
      const title      = getRoadmapTitle(r.roadmap);
      return {
        id:           getProgressId(r.roadmap),
        title:        badge?.title || `${title || "Roadmap"} Badge`,
        imageURL:     badge?.imageURL || badge?.image || null,
        roadmapTitle: title || "Completed Roadmap",
        earned:       true,
      };
    });

  const inProgressBadges = roadmapProgress
    .filter((r: any) => {
      const total = getSafeTotal(r);
      return total > 0 && r.completedSections.length < total;
    })
    .map((r: any) => {
      const roadmapObj = typeof r.roadmap === "object" ? r.roadmap : null;
      const badge      = roadmapObj?.badge ?? null;
      const title      = getRoadmapTitle(r.roadmap);
      return {
        id:           getProgressId(r.roadmap),
        title:        badge?.title || `${title || "Roadmap"} Badge`,
        imageURL:     badge?.imageURL || badge?.image || null,
        roadmapTitle: title || "In Progress Roadmap",
        earned:       false,
      };
    });

  const allBadges = [...earnedBadges, ...inProgressBadges];

  // Recent activity from quiz progress
  const recentActivity = quizProgress.slice(0, 3).map((q, i) => ({
    text:  `Completed "${getProgressTitle(q.quiz) || "a quiz"}"`,
    time:  i === 0 ? "Today" : i === 1 ? "Yesterday" : "2 days ago",
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <span>›</span>
          <span className="text-primary font-medium">Achievements</span>
        </nav>

        {/* ── Top stat cards ──────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <div className="rounded-2xl bg-primary text-white p-5">
            <p className="text-sm text-white/80 mb-1">Total Badges Earned</p>
            <div className="flex items-center justify-between">
              <p className="text-4xl font-bold">{String(earnedBadges.length).padStart(2,"0")}</p>
              <Award size={32} className="text-white/50" />
            </div>
          </div>
          <div className="rounded-2xl bg-muted border border-border p-5">
            <p className="text-sm text-muted-foreground mb-1">Achievements Unlocked</p>
            <div className="flex items-center justify-between">
              <p className="text-4xl font-bold text-foreground">{passedCount}/{quizProgress.length || "—"}</p>
              <Trophy size={32} className="text-muted-foreground/40" />
            </div>
          </div>
          <div className="rounded-2xl bg-orange-500 text-white p-5">
            <p className="text-sm text-white/80 mb-1">Current Learning Streak</p>
            <div className="flex items-center justify-between">
              <p className="text-4xl font-bold">{streakDays} <span className="text-xl font-medium">{streakDays === 1 ? "day" : "days"}</span></p>
              <Flame size={32} className="text-white/50" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Main column ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Badges gallery — from real roadmap badge images */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Badges Gallery</h2>
              </div>

              {allBadges.length === 0 ? (
                <div className="devmap-card text-center py-10">
                  <Award size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold text-foreground mb-1">No Badges Yet</p>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Complete a roadmap to earn your first badge.
                  </p>
                  <Link href="/roadmap" className="btn-primary text-sm px-5 py-2 rounded-xl mt-4 inline-flex justify-center">
                    Browse Roadmaps
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`devmap-card text-center transition-all ${
                        !badge.earned ? "opacity-60 border-dashed" : "hover:border-primary/30"
                      }`}
                    >
                      {/* Badge image or placeholder */}
                      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-border bg-muted flex items-center justify-center">
                        {badge.imageURL ? (
                          <Image
                            src={badge.imageURL}
                            alt={badge.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          badge.earned
                            ? <Award size={28} className="text-primary" />
                            : <Lock size={24} className="text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-bold text-sm text-foreground mb-1">{badge.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        {badge.earned ? `Completed ${badge.roadmapTitle}` : `Complete ${badge.roadmapTitle} to earn`}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                        badge.earned
                          ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {badge.earned
                          ? <><CheckCircle2 size={9} /> Earned</>
                          : <><Lock size={9} /> In Progress</>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements progress */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Achievements</h2>
              <div className="space-y-3">
                {ACHIEVEMENT_DEFS.map((ach) => {
                  const Icon = ach.icon;
                  const progress = ach.key === "fast-learner"
                    ? Math.min(passedCount * 2, ach.target)
                    : ach.key === "community"
                    ? Math.min(passedCount, ach.target)
                    : Math.min(passedCount * 3, ach.target);
                  const pct  = Math.round((progress / ach.target) * 100);
                  const done = progress >= ach.target;
                  return (
                    <div key={ach.key} className="devmap-card">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          done ? "bg-green-100 dark:bg-green-950/30 text-green-600" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm text-foreground">{ach.label}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{progress}/{ach.target}</span>
                              {done && <CheckCircle2 size={14} className="text-green-500" />}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{ach.desc}</p>
                          <div className="devmap-progress">
                            <div
                              className={`devmap-progress-fill ${done ? "!bg-green-500" : ""}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ───────────────────────────────────── */}
          <div className="space-y-5">
            {/* Rankings */}
            <div className="devmap-card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="font-bold text-foreground">Rankings</h3>
              </div>
              <div className="space-y-2">
                {[
                  { rank: "01", name: "Sarah Chen",                    pts: "4,250", you: false },
                  { rank: "14", name: profile?.username ?? "You",      pts: "2,840", you: true  },
                  { rank: "15", name: "Jordan Smith",                  pts: "2,790", you: false },
                ].map((entry) => (
                  <div key={entry.rank} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    entry.you ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                  }`}>
                    <span className={`text-sm font-bold w-6 shrink-0 ${entry.you ? "text-primary" : "text-muted-foreground"}`}>
                      {entry.rank}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {entry.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${entry.you ? "text-primary" : "text-foreground"}`}>
                        {entry.you ? `You (${entry.name})` : entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.pts} pts</p>
                    </div>
                    {entry.you && <ChevronUp size={14} className="text-primary shrink-0" />}
                    {!entry.you && entry.rank === "01" && <Award size={14} className="text-amber-500 shrink-0" />}
                  </div>
                ))}
              </div>
              <button className="btn-secondary w-full mt-4 py-2 rounded-xl text-sm justify-center">
                Full Leaderboard
              </button>
            </div>

            {/* Recent activity */}
            <div className="devmap-card">
              <h3 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wide">Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Complete a quiz to see your activity here.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground leading-snug">{act.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
