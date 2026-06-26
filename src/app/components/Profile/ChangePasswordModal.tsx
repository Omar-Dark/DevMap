"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { changePasswordProps } from "@/app/types/api";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { validateChangePassword } from "@/app/validators";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Lock, Loader2 } from "lucide-react";

const ChangePasswordModal = ({ setChangePassword }: { setChangePassword: Dispatch<SetStateAction<boolean>> }) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [changePasswordData, setChangePasswordData] = useState<changePasswordProps>({
    confirmPassword: "", currentPassword: "", password: "",
  });

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError("");
      const validatorError = validateChangePassword(changePasswordData.password, changePasswordData?.confirmPassword, changePasswordData?.currentPassword);
      if (validatorError) { setError(validatorError); setLoading(false); return; }

      const res = await RoadmapApiAxiosInstance.put(apiRoutes.Users.changePassword.route, changePasswordData);
      if (res.data?.success) {
        toast.success("Password changed successfully");
        setChangePassword(false);
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
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Current Password</label>
          <input className={inputClass} type="password" value={changePasswordData.currentPassword}
            onChange={(e) => setChangePasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="Enter current password" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">New Password</label>
          <input className={inputClass} type="password" value={changePasswordData.password}
            onChange={(e) => setChangePasswordData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Enter new password" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Confirm New Password</label>
        <input className={inputClass} type="password" value={changePasswordData?.confirmPassword}
          onChange={(e) => setChangePasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder="Confirm new password" />
      </div>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <button onClick={handleChangePassword} disabled={loading} className="btn-primary w-full py-3 rounded-xl justify-center">
        {loading ? <><Loader2 size={15} className="animate-spin" /> Updating...</> : <><Lock size={15} /> Update Password</>}
      </button>
    </div>
  );
};

export default ChangePasswordModal;
