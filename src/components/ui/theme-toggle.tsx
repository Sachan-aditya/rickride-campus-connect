
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    // Set body class based on dark state
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(v => !v);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full w-9 h-9 p-0 z-50 ${className}`}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500" />
      )}
    </Button>
  );
}
