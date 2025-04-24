
import React from "react";
import { useTheme } from "next-themes";

interface RickRideLogoProps {
  className?: string;
  size?: number;
  theme?: "light" | "dark"; // Add theme prop to the interface
}

export default function RickRideLogo({
  className = "",
  size = 44,
  theme, // Add theme to the component props
}: RickRideLogoProps) {
  const { resolvedTheme } = useTheme();
  
  // If a theme is explicitly provided, use it; otherwise, use the resolvedTheme
  const isDark = theme ? theme === "dark" : resolvedTheme === "dark";
  
  return (
    <span className={className} style={{ display: "inline-block" }}>
      <div className="flex items-center font-bold text-xl">
        <span className={isDark ? "text-white" : "text-black"}>Rick</span>
        <span className="text-[#4F8EF7]">Ride</span>
      </div>
    </span>
  );
}
