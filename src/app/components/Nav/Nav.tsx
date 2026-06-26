"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MainTitle from "../Home/MainTitle";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import RenderAuthArea from "./RenderAuthArea";
import Theme from "./Theme";
import {
  LayoutDashboard,
  Map,
  Trophy,
  User,
  Settings,
  Info,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";

const Nav = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.user
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const path = usePathname();
  const isPublicPage = path === "/" || path.startsWith("/auth");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/roadmap",        label: "Roadmaps",     scrollId: null          },
    { href: "/#milestones",    label: "Milestones",   scrollId: "milestones"  },
    { href: "/#ai-assistant",  label: "AI Assistant", scrollId: "ai-assistant"},
  ];

  const handleNavClick = (e: React.MouseEvent, scrollId: string | null) => {
    setMobileMenuOpen(false);
    if (scrollId && path === "/") {
      e.preventDefault();
      document.getElementById(scrollId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ── Public / landing nav ─────────────────────────────────────────
  if (isPublicPage) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-6">
          <div className="shrink-0">
            <MainTitle />
          </div>

          {/* Desktop centered nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.scrollId)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  path === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 shrink-0">
            <Theme iconOnly />
            <RenderAuthArea
              dropdownRef={dropdownRef}
              isAuthenticated={isAuthenticated}
              loading={loading}
              openProfile={openProfile}
              setOpenProfile={setOpenProfile}
              user={user!}
            />
            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border md:hidden">
            <nav className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.scrollId)}
                  className="flex items-center py-3 text-sm font-medium text-foreground hover:text-primary border-b border-border/50 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-3 pt-3">
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="flex-1 btn-secondary text-sm py-2.5 rounded-xl justify-center">Sign In</Link>
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 btn-primary text-sm py-2.5 rounded-xl justify-center">Get Started</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </>
    );
  }

  // ── App sidebar layout ───────────────────────────────────────────
  const sideLinks = [
    { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard, exact: true },
    { href: "/roadmap",      label: "Roadmaps",     icon: Map              },
    { href: "/achievements", label: "Achievements", icon: Trophy           },
    { href: "/project",      label: "Projects",     icon: FolderKanban     },
    { href: "/profile",      label: "Profile",      icon: User             },
    { href: "/settings",     label: "Settings",     icon: Settings         },
    { href: "/about",        label: "About",        icon: Info, exact: true},
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return path === href;
    return path.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`devmap-sidebar ${mobileSidebarOpen ? "open" : ""}`}>
        <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
          <MainTitle />
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {sideLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`devmap-nav-item ${active ? "active" : ""}`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`devmap-nav-item ${path.startsWith("/admin") ? "active" : ""}`}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <ShieldCheck size={16} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        <div className="border-t border-sidebar-border p-3 shrink-0 text-xs text-muted-foreground text-center">
          DevMap © 2026
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sticky top bar — only for app pages, rendered inside .devmap-main via layout */}
      <div className="fixed top-0 left-0 right-0 md:left-[200px] z-40 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center gap-3 px-4 md:px-6">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search roadmap topics..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-muted rounded-lg border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <Theme iconOnly />
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5.5 5.5 0 0 1 5.5 5.5c0 2.5.8 3.8 1.5 4.5H2c.7-.7 1.5-2 1.5-4.5A5.5 5.5 0 0 1 9 2Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 14.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 8v5M9 6v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div ref={dropdownRef}>
            <RenderAuthArea
              dropdownRef={dropdownRef}
              isAuthenticated={isAuthenticated}
              loading={loading}
              openProfile={openProfile}
              setOpenProfile={setOpenProfile}
              user={user!}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
