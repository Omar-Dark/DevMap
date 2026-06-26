'use client'
import NavAuthLoading from "./NavAuthLoading";
import ProfileWindow from "./ProfileWindow";
import Link from "next/link";
import { RenderAuthAreaProps } from "@/app/types/UI";
import Image from "next/image";

const RenderAuthArea = ({
  loading,
  user,
  isAuthenticated,
  openProfile,
  setOpenProfile,
  dropdownRef,
}: RenderAuthAreaProps) => {
  if (loading) {
    return <NavAuthLoading />;
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="Open profile menu"
        >
          {user.imageURL ? (
            <Image
              src={user.imageURL}
              alt={user.username || "User"}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              {(user.username || "U")[0].toUpperCase()}
            </div>
          )}
        </button>
        {openProfile && (
          <ProfileWindow
            setOpenProfile={setOpenProfile}
            user={user}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="btn-primary text-sm px-4 py-2 rounded-lg"
      >
        Get Started
      </Link>
    </div>
  );
};

export default RenderAuthArea;
