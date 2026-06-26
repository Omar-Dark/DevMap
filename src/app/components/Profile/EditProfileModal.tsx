"use client";
import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { updateProfileProps } from "@/app/types/roadmap";
import { useState } from "react";
import { AxiosError } from "axios";
import { validateUpdateUserData } from "@/app/validators";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser } from "@/app/redux/Slices/userSlice";
import { EditProfileModalProps } from "@/app/types/UI";
import { UsersProps } from "@/app/types/api";
import { Edit, Loader2 } from "lucide-react";

const EditProfileModal = ({ profile, setEditProfile, setUsersData }: EditProfileModalProps) => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [updateProfile, setUpdateProfile] = useState<updateProfileProps>({
    username: profile?.username || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
  });

  const handleEditProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const validatorError = validateUpdateUserData(updateProfile.username || "", updateProfile.email || "", updateProfile.bio || "");
      if (validatorError) { setError(validatorError); setLoading(false); return; }

      const res = await RoadmapApiAxiosInstance.put(apiRoutes.Users.updateUserById.route(profile._id || ""), updateProfile);

      if (res.data?.success) {
        setUsersData?.((prev: UsersProps) => {
          if (!prev) return prev;
          return { ...prev, users: prev.users.map((user) => user._id === profile._id ? { ...user, ...updateProfile } : user) };
        });
        dispatch(updateUser({ username: updateProfile.username, email: updateProfile.email }));
        toast.success("Profile updated successfully");
        setEditProfile(false);
      } else {
        setError(res.data?.message || "Something went wrong");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setError(axiosError.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground";

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Username</label>
          <input
            className={inputClass}
            type="text"
            value={updateProfile?.username}
            onChange={(e) => setUpdateProfile((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="Enter username"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            className={inputClass}
            type="email"
            value={updateProfile?.email}
            onChange={(e) => setUpdateProfile((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Bio</label>
        <textarea
          className={`${inputClass} resize-none h-24`}
          value={updateProfile?.bio}
          onChange={(e) => setUpdateProfile((prev) => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell something about yourself"
        />
      </div>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <button
        onClick={handleEditProfile}
        disabled={loading}
        className="btn-primary w-full py-3 rounded-xl justify-center"
      >
        {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Edit size={15} /> Save Profile Changes</>}
      </button>
    </div>
  );
};

export default EditProfileModal;
