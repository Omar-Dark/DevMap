"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Trophy, FolderKanban, ShieldCheck } from "lucide-react";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";

const PhoneMenu = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.user);

  const isPublicPage = pathname === "/" || pathname.startsWith("/auth");
  if (isPublicPage) return null;

  const links = [
    { href: "/roadmap", label: "Roadmaps", icon: Map },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/project", label: "Projects", icon: FolderKanban },
    ...(user?.isAdmin ? [{ href: "/admin", label: "Admin", icon: ShieldCheck }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-2 h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} className={active ? "text-primary" : ""} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default PhoneMenu;
