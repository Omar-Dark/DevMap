import AuthWindow from "@/app/components/Auth/AuthWindow";
import MainTitle from "@/app/components/Home/MainTitle";
import Link from "next/link";

const Auth = () => {
  return (
    <div className="auth-bg">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <MainTitle />
        </div>
      </div>

      {/* Sign In form (default shown) — tab switching inside AuthWindow */}
      <div className="w-full max-w-sm">
        {/* Heading above card */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-sm text-muted-foreground mt-1">Ready to continue your journey?</p>
        </div>

        <AuthWindow />

        {/* Switch tab hint */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-muted-foreground">
        <p>© 2026 DevMap Learning. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
