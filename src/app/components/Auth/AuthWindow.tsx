"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  validateSignInCredentials,
  validateSignUpCredentials,
} from "@/app/validators";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/redux/Slices/userSlice";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon: React.ReactNode;
}

const InputField = ({ label, placeholder, value, onChange, type = "text", icon }: InputFieldProps) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          type={isPassword ? (showPw ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

const AuthWindow = ({ defaultTab = "signin" }: { defaultTab?: "signin" | "signup" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState<"signup" | "signin">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleTabChange = (tab: "signup" | "signin") => {
    setCurrentTab(tab);
    setEmail(""); setPassword(""); setUsername(""); setError("");
  };

  const handleSignUp = async () => {
    const validatorError = validateSignUpCredentials(username, email, password);
    if (validatorError) { setError(validatorError); return; }
    setLoading(true);
    try {
      const res = await RoadmapApiAxiosInstance.post(apiRoutes.Auth.signup.route, { username, email, password });
      if (!res.data.success) { setError(res.data.message); }
      else { dispatch(setUser(res.data.user)); router.push("/dashboard"); }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  const handleSignIn = async () => {
    const validatorError = validateSignInCredentials(email, password);
    if (validatorError) { setError(validatorError); return; }
    setLoading(true);
    try {
      const res = await RoadmapApiAxiosInstance.post(apiRoutes.Auth.login.route, { email, password });
      if (!res.data.success) { setError(res.data.message); }
      else { dispatch(setUser(res.data.user)); router.push("/dashboard"); }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-xl p-8 space-y-6">
      <AnimatePresence mode="wait">
        {currentTab === "signin" ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="space-y-1">
              <InputField label="Email Address" placeholder="name@company.com" value={email} onChange={setEmail} type="email" icon={<Mail size={15} />} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button className="text-xs text-primary hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock size={15} /></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              Keep me signed in
            </label>
            {error && <p className="text-destructive text-xs text-center">{error}</p>}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl justify-center text-sm"
            >
              {loading ? "Signing in…" : <>Sign In <ArrowRight size={15} /></>}
            </button>

            {/* Social divider */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />OR CONTINUE WITH<div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Google", icon: "G" },
                { label: "GitHub", icon: "⬡" },
              ].map((s) => (
                <button key={s.label} className="btn-secondary py-2.5 rounded-xl justify-center text-sm">
                  <span className="font-bold">{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <InputField label="Full Name" placeholder="John Doe" value={username} onChange={setUsername} icon={<User size={15} />} />
            <InputField label="Email Address" placeholder="name@company.com" value={email} onChange={setEmail} type="email" icon={<Mail size={15} />} />
            <div className="space-y-1">
              <InputField label="Password" placeholder="••••••••" value={password} onChange={setPassword} type="password" icon={<Lock size={15} />} />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
            </div>
            {error && <p className="text-destructive text-xs text-center">{error}</p>}
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl justify-center text-sm"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />OR CONTINUE WITH<div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: "Google", icon: "G" }, { label: "GitHub", icon: "⬡" }].map((s) => (
                <button key={s.label} className="btn-secondary py-2.5 rounded-xl justify-center text-sm">
                  <span className="font-bold">{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthWindow;
