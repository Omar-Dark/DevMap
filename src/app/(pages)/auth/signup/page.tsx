import AuthWindow from "@/app/components/Auth/AuthWindow";
import MainTitle from "@/app/components/Home/MainTitle";
import Link from "next/link";
import { Award, CheckCircle2 } from "lucide-react";

const SignUp = () => {
  return (
    <div className="auth-bg relative overflow-hidden">
      {/* Decorative floating cards — desktop only, echoes the design screenshot */}
      <div className="hidden lg:block absolute top-[18%] right-[10%] w-56 rounded-2xl bg-card border border-border shadow-xl p-4 -rotate-3 opacity-80">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <Award size={18} className="text-muted-foreground" />
        </div>
        <div className="h-2.5 w-full rounded bg-muted mb-1.5" />
        <div className="h-2.5 w-2/3 rounded bg-muted" />
      </div>
      <div className="hidden lg:block absolute top-[34%] right-[6%] w-60 rounded-2xl bg-card border border-border shadow-xl p-4 rotate-2 opacity-90">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
          <CheckCircle2 size={18} className="text-green-500" />
        </div>
        <div className="h-2.5 w-full rounded bg-muted mb-1.5" />
        <div className="h-16 w-full rounded-lg bg-primary/10 mt-2" />
      </div>

      {/* Logo + heading */}
      <div className="mb-8 text-center relative z-10">
        <div className="flex justify-center mb-4">
          <MainTitle />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Start Your Tech Journey</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Create an account to track your progress and earn certifications.
        </p>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <AuthWindow defaultTab="signup" />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      <div className="mt-12 text-center text-xs text-muted-foreground relative z-10">
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
