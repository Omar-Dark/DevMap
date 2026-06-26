"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout as clearUser } from "@/app/redux/Slices/userSlice";
import { useRouter } from "next/navigation";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import { UserProps } from "@/app/types/api";
import { LogOut, User, Settings, Shield } from "lucide-react";

const ProfileWindow = ({
  user,
  setOpenProfile,
}: {
  user: UserProps;
  setOpenProfile: (v: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await RoadmapApiAxiosInstance.post(apiRoutes.Auth.logout.route);
    } catch {
      // ignore
    } finally {
      dispatch(clearUser());
      router.push("/");
      setOpenProfile(false);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl py-1 z-50">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">{user?.username}</p>
        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
      </div>
      <div className="py-1">
        <Link
          href="/profile"
          onClick={() => setOpenProfile(false)}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
        >
          <User size={14} />
          Profile
        </Link>
        <Link
          href="/settings"
          onClick={() => setOpenProfile(false)}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
        >
          <Settings size={14} />
          Settings
        </Link>
        {user?.isAdmin && (
          <Link
            href="/admin"
            onClick={() => setOpenProfile(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
          >
            <Shield size={14} />
            Admin Panel
          </Link>
        )}
      </div>
      <div className="border-t border-border py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileWindow;
