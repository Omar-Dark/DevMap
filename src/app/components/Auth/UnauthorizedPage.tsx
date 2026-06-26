"use client";
import Link from "next/link";
import { Lock, LogIn, ArrowLeft, Shield } from "lucide-react";

export default function UnauthorizedPage({
  mode,
}: {
  mode: "admin" | "authenticate";
}) {
  const isAdmin = mode === "admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
            isAdmin ? "bg-destructive/10 border border-destructive/20" : "bg-primary/10 border border-primary/20"
          }`}>
            {isAdmin ? (
              <Shield size={32} className="text-destructive" />
            ) : (
              <Lock size={32} className="text-primary" />
            )}
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? "Admin Access Required" : "Sign In Required"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isAdmin
              ? "You need administrator privileges to view this page. Contact your system administrator if you believe this is an error."
              : "Please sign in to your DevMap account to continue your learning journey."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {!isAdmin && (
            <Link href="/auth" className="btn-primary py-3 rounded-xl text-sm justify-center">
              <LogIn size={14} />
              Sign In
            </Link>
          )}
          <Link href="/" className="btn-secondary py-3 rounded-xl text-sm justify-center">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
