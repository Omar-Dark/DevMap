"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout, setLoading } from "@/app/redux/Slices/userSlice";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { InternalAxiosRequestConfig } from "axios";

/** Update the daily login streak stored in localStorage.
 *  Rules:
 *  - New user  → streak = 1
 *  - Same day  → no change (already counted today)
 *  - Next day  → streak + 1
 *  - Missed day(s) → reset to 1
 */
export const updateStreak = (): number => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem("devmap_streak");
  
  if (!stored) {
    // Brand new user
    const initial = JSON.stringify({ count: 1, lastDate: today });
    localStorage.setItem("devmap_streak", initial);
    return 1;
  }

  try {
    const { count, lastDate } = JSON.parse(stored) as { count: number; lastDate: string };

    if (lastDate === today) {
      // Already logged in today — keep current streak
      return count;
    }

    const last     = new Date(lastDate);
    const now      = new Date(today);
    const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    const newCount = diffDays === 1 ? count + 1 : 1; // +1 if yesterday, reset otherwise
    localStorage.setItem("devmap_streak", JSON.stringify({ count: newCount, lastDate: today }));
    return newCount;
  } catch {
    // Corrupted data — reset
    localStorage.setItem("devmap_streak", JSON.stringify({ count: 1, lastDate: today }));
    return 1;
  }
};

/** Read the current streak count without mutating it */
export const getStreak = (): number => {
  try {
    const stored = localStorage.getItem("devmap_streak");
    if (!stored) return 0;
    return JSON.parse(stored).count ?? 0;
  } catch { return 0; }
};

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const res = await RoadmapApiAxiosInstance.get(
          apiRoutes.Users.getProfile.route,
          { _silentAuth: true } as InternalAxiosRequestConfig & { _silentAuth?: boolean },
        );
        if (res.data.user) {
          updateStreak(); // Count this login toward the streak
        }
        dispatch(setUser(res.data.user));
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };
    checkAuth();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
