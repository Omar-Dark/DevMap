"use client";
import { useMemo, useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { userProgressProps } from "@/app/types/api";

const ProgressCircle = ({ userProgress }: { userProgress: userProgressProps }) => {
  const safeCompleted = Math.min(userProgress?.completed ?? 0, userProgress?.total ?? 0);
  const safeTotal = userProgress?.total ?? 0;

  const percentage = useMemo(() => {
    if (!safeTotal) return 0;
    return Math.round((safeCompleted / safeTotal) * 100);
  }, [safeCompleted, safeTotal]);

  const progress = useMotionValue(0);
  const progressNumber = useTransform(progress, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(progress, percentage, { type: "spring", stiffness: 120, damping: 20 });
    return () => controls.stop();
  }, [percentage, progress]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(
    progress,
    (v) => circumference - (v / 100) * circumference
  );

  return (
    <div className="devmap-card text-center">
      {/* Circle */}
      <div className="relative w-28 h-28 mx-auto mb-4">
        <svg className="transform -rotate-90" width="112" height="112" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={radius} strokeWidth="8" className="stroke-muted" fill="transparent" />
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            strokeWidth="8"
            fill="transparent"
            stroke="url(#devmap-gradient)"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
          />
          <defs>
            <linearGradient id="devmap-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B4FD8" />
              <stop offset="100%" stopColor="#3B72F6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">
            <motion.span>{progressNumber}</motion.span>%
          </span>
        </div>
      </div>

      <p className="text-sm font-semibold text-foreground mb-1">Overall Progress</p>
      <p className="text-xs text-muted-foreground">
        {safeCompleted} of {safeTotal} sections completed
      </p>

      {/* Linear progress bar */}
      <div className="mt-4 devmap-progress">
        <div className="devmap-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressCircle;
