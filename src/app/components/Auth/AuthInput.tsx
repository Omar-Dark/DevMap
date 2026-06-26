"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const AuthInput = ({ label, placeholder, value, onChange, type = "text" }: AuthInputProps) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (showPw ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
