"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const Theme = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  if (iconOnly) {
    return (
      <button
        onClick={toggleTheme}
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
      >
        {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center gap-2 p-2.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground w-full"
    >
      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default Theme;
