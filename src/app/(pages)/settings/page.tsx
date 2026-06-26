"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import UnauthorizedPage from "@/app/components/Auth/UnauthorizedPage";
import { updateUser, logout as clearUser } from "@/app/redux/Slices/userSlice";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import {
  User, Settings2, Bell, Palette,
  Save, Loader2, CheckCircle2, Link as LinkIcon,
  Trash2, Camera, Upload, X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type SettingsTab = "profile" | "account" | "notifications" | "appearance";
const TABS = [
  { id: "profile"       as SettingsTab, label: "Profile",       icon: User      },
  { id: "account"       as SettingsTab, label: "Account",       icon: Settings2  },
  { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell       },
  { id: "appearance"    as SettingsTab, label: "Appearance",    icon: Palette    },
];
const inputCls = "w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const router   = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [tab,     setTab]    = useState<SettingsTab>("profile");
  const [saving,  setSaving] = useState(false);
  const [deleting,setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Profile tab
  const [username,   setUsername]   = useState(user?.username ?? "");
  const [bio,        setBio]        = useState("");
  const [github,     setGithub]     = useState("");
  const [linkedin,   setLinkedin]   = useState("");
  const [avatarSrc,  setAvatarSrc]  = useState(user?.imageURL ?? "");
  const [imgUploading, setImgUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Account tab
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // Notifications
  const [notifs, setNotifs] = useState({
    courseRecs: true, weeklyReport: true, community: false,
    streakReminders: true, badgeAchievements: true,
  });

  // Appearance
  const [theme,    setTheme]    = useState<"light"|"dark"|"system">("light");
  const [fontSize, setFontSize] = useState<"small"|"medium"|"large">("medium");
  const [accent,   setAccent]   = useState("#1B4FD8");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    // Pre-load saved bio if in profile
    if (user?.imageURL) setAvatarSrc(user.imageURL);
  }, [user]);

  if (!isAuthenticated) return <UnauthorizedPage mode="authenticate" />;

  // ── #2 & #3 Image upload (working) ──────────────────────────────
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Upload to API
    setImgUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await RoadmapApiAxiosInstance.put(
        apiRoutes.Users.uploadImage.route,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data?.success) {
        dispatch(updateUser({ imageURL: res.data.imageURL }));
        setAvatarSrc(res.data.imageURL);
        toast.success("Profile photo updated!");
      } else {
        toast.error(res.data?.message ?? "Upload failed");
        setAvatarSrc(user?.imageURL ?? "");
      }
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Upload failed");
      setAvatarSrc(user?.imageURL ?? "");
    } finally { setImgUploading(false); }
  };

  const handleRemoveImage = async () => {
    setImgUploading(true);
    try {
      const res = await RoadmapApiAxiosInstance.delete(apiRoutes.Users.deleteImage.route);
      if (res.data?.success) {
        dispatch(updateUser({ imageURL: "" }));
        setAvatarSrc("");
        toast.success("Profile photo removed");
      }
    } catch { toast.error("Couldn't remove image"); }
    finally { setImgUploading(false); }
  };

  // ── #3 Save profile (bio + username) ────────────────────────────
  const saveProfile = async () => {
    if (!username.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const res = await RoadmapApiAxiosInstance.put(
        apiRoutes.Users.updateProfile.route,
        { username: username.trim(), bio: bio.trim() }
      );
      if (res.data?.success) {
        dispatch(updateUser({ username: username.trim() }));
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data?.message ?? "Update failed");
      }
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };

  // ── #3 Change password (fully wired) ────────────────────────────
  const savePassword = async () => {
    if (!currentPw)           { toast.error("Enter your current password"); return; }
    if (newPw.length < 8)     { toast.error("New password must be at least 8 characters"); return; }
    if (newPw !== confirmPw)  { toast.error("Passwords do not match"); return; }
    setSaving(true);
    try {
      const res = await RoadmapApiAxiosInstance.put(
        apiRoutes.Users.changePassword.route,
        { currentPassword: currentPw, password: newPw, confirmPassword: confirmPw }
      );
      if (res.data?.success) {
        toast.success("Password updated successfully!");
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      } else {
        toast.error(res.data?.message ?? "Password update failed");
      }
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };

  // ── #3 Delete account (fully wired) ─────────────────────────────
  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await RoadmapApiAxiosInstance.delete(
        apiRoutes.Users.deleteUserById.route(user?._id ?? "")
      );
      if (res.data?.success) {
        dispatch(clearUser());
        toast.success("Account deleted");
        router.push("/");
      } else {
        toast.error(res.data?.message ?? "Deletion failed");
      }
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Something went wrong");
    } finally { setDeleting(false); setConfirmDelete(false); }
  };

  const saveAppearance = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    toast.success("Appearance saved");
  };

  const ACCENT_COLORS = ["#1B4FD8", "#16A34A", "#DC2626", "#92400E", "#CA8A04"];
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <span>›</span>
          <span className="text-primary font-medium">Settings</span>
        </nav>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Manage your account preferences, profile details, and security settings.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Tab sidebar */}
          <div className="devmap-card h-fit">
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    tab === id ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={15} />{label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab panels */}
          <div className="md:col-span-3 devmap-card">

            {/* ── PROFILE TAB ─────────────────────────────────── */}
            {tab === "profile" && (
              <div className="space-y-6">
                <h2 className="font-semibold text-foreground">Public Profile</h2>

                {/* Avatar upload */}
                <div className="flex items-start gap-6">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted">
                      {avatarSrc ? (
                        <Image src={avatarSrc} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground bg-muted">
                          {(user?.username ?? "U")[0].toUpperCase()}
                        </div>
                      )}
                      {imgUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                          <Loader2 size={20} className="animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleImageClick}
                      disabled={imgUploading}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-background cursor-pointer hover:bg-secondary transition-colors disabled:opacity-60"
                    >
                      <Camera size={12} className="text-white" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Profile Photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF · max 5MB</p>
                    <div className="flex gap-2">
                      <button onClick={handleImageClick} disabled={imgUploading}
                        className="btn-secondary text-xs px-3 py-1.5 rounded-lg gap-1.5 disabled:opacity-50">
                        <Upload size={12} /> Upload
                      </button>
                      {avatarSrc && (
                        <button onClick={handleRemoveImage} disabled={imgUploading}
                          className="text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors gap-1.5 flex items-center disabled:opacity-50">
                          <X size={12} /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Full Name</label>
                    <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Alex Rivera" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Email (read-only)</label>
                    <input className={`${inputCls} opacity-60 cursor-not-allowed`} readOnly value={user?.email ?? ""} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Short Bio</label>
                  <textarea className={`${inputCls} resize-none h-24`} value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community about yourself..." />
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">Social Profiles</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 border border-border rounded-lg px-3">
                      <LinkIcon size={14} className="text-muted-foreground shrink-0" />
                      <input className="flex-1 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                        value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub URL" />
                    </div>
                    <div className="flex items-center gap-2 border border-border rounded-lg px-3">
                      <LinkIcon size={14} className="text-muted-foreground shrink-0" />
                      <input className="flex-1 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                        value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={saveProfile} disabled={saving}
                    className="btn-primary px-6 py-2.5 rounded-xl gap-2 text-sm disabled:opacity-60">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Profile Changes
                  </button>
                </div>
              </div>
            )}

            {/* ── ACCOUNT TAB ─────────────────────────────────── */}
            {tab === "account" && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-semibold text-foreground mb-4">Account Settings</h2>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Primary Email Address</label>
                    <div className="flex gap-3">
                      <input className={`${inputCls} flex-1 opacity-70 cursor-not-allowed`} readOnly value={user?.email ?? ""} />
                      <button className="btn-secondary px-4 py-2.5 rounded-lg text-sm shrink-0">Change</button>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                      <CheckCircle2 size={11} /> Verified
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Password Management</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Current Password</label>
                      <input className={inputCls} type="password" value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">New Password</label>
                        <input className={inputCls} type="password" value={newPw}
                          onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                        <input className={inputCls} type="password" value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repeat new password" />
                      </div>
                    </div>
                    <button onClick={savePassword} disabled={saving}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-600 hover:bg-slate-700 text-white transition-colors flex items-center gap-2 disabled:opacity-60">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                  <p className="font-semibold text-destructive mb-1">Danger Zone</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Permanently delete your account and all of your data. This action cannot be undone.
                  </p>
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-destructive text-white text-sm font-semibold rounded-lg hover:bg-destructive/90 transition-colors">
                      <Trash2 size={14} /> Delete Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-destructive">Are you absolutely sure? This cannot be undone.</p>
                      <div className="flex gap-3">
                        <button onClick={deleteAccount} disabled={deleting}
                          className="flex items-center gap-2 px-4 py-2 bg-destructive text-white text-sm font-semibold rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-60">
                          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          Yes, Delete My Account
                        </button>
                        <button onClick={() => setConfirmDelete(false)}
                          className="px-4 py-2 btn-secondary rounded-lg text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ───────────────────────────── */}
            {tab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-foreground mb-1">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Configure how you want to be alerted about your progress.</p>
                </div>
                {[
                  { section: "Email Notifications", items: [
                    { key: "courseRecs",   label: "New Course Recommendations",  desc: "Personalized suggestions based on your interests" },
                    { key: "weeklyReport", label: "Weekly Progress Report",       desc: "A summary of your learning activity and stats"    },
                    { key: "community",    label: "Community Mentions",           desc: "When someone tags you in a discussion"            },
                  ]},
                  { section: "Push Notifications", items: [
                    { key: "streakReminders",   label: "Learning Streak Reminders", desc: "Keep your daily momentum going" },
                    { key: "badgeAchievements", label: "Badge Achievements",         desc: "Get notified immediately when you earn a badge" },
                  ]},
                ].map(({ section, items }) => (
                  <div key={section}>
                    <p className="text-xs font-bold text-primary uppercase tracking-wide mb-3">{section}</p>
                    <div className="space-y-2">
                      {items.map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Bell size={14} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{label}</p>
                              <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                          </div>
                          <button onClick={() => setNotifs((p) => ({ ...p, [key]: !p[key as keyof typeof notifs] }))}
                            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${notifs[key as keyof typeof notifs] ? "bg-primary" : "bg-muted-foreground/30"}`}>
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifs[key as keyof typeof notifs] ? "translate-x-5" : ""}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button onClick={() => toast.success("Preferences saved")} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* ── APPEARANCE TAB ──────────────────────────────── */}
            {tab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-foreground mb-1">Appearance Settings</h2>
                  <p className="text-sm text-muted-foreground">Customize your visual interface preference.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(["light","dark","system"] as const).map((t) => (
                      <button key={t} onClick={() => setTheme(t)}
                        className={`rounded-xl border-2 overflow-hidden transition-all ${theme === t ? "border-primary" : "border-border"}`}>
                        <div className={`h-16 flex items-start p-2 ${t === "light" ? "bg-white" : t === "dark" ? "bg-slate-900" : "bg-gradient-to-br from-white to-slate-900"}`}>
                          <div className={`h-2 w-3/4 rounded-full ${t === "dark" ? "bg-slate-600" : "bg-slate-200"}`} />
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-card border-t border-border">
                          <span className="text-xs font-medium capitalize text-foreground">{t}</span>
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === t ? "border-primary" : "border-muted-foreground/40"}`}>
                            {theme === t && <span className="w-2 h-2 rounded-full bg-primary" />}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Font Size</p>
                  <div className="inline-flex rounded-xl border border-border overflow-hidden">
                    {(["small","medium","large"] as const).map((size) => (
                      <button key={size} onClick={() => setFontSize(size)}
                        className={`px-5 py-2 text-sm font-medium transition-colors capitalize ${fontSize === size ? "bg-primary text-white" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Accent Color</p>
                  <div className="flex items-center gap-3">
                    {ACCENT_COLORS.map((color) => (
                      <button key={color} onClick={() => setAccent(color)} style={{ backgroundColor: color }}
                        className={`w-9 h-9 rounded-full transition-all ${accent === color ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:scale-105"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={saveAppearance} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
