import Link from "next/link";
import MainTitle from "./MainTitle";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <MainTitle />
            <p className="text-xs text-muted-foreground mt-1.5">
              Empowering the next generation of engineers.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 DevMap Learning. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
