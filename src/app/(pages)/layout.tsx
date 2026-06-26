export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps all authenticated/app pages.
  // The Nav component renders the sidebar and .devmap-main topbar.
  // Page content flows here, inside the .devmap-main CSS class (via margin-left).
  return (
    <div className="devmap-main min-h-screen">
      {/* The 64px topbar is sticky inside .devmap-main */}
      <div className="pt-16">{children}</div>
    </div>
  );
}
