
import React from "react";
import { useTheme } from "next-themes";

interface RickRideLogoProps {
  className?: string;
  size?: number;
}

export default function RickRideLogo({
  className = "",
  size = 44,
}: RickRideLogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  // Colors based on the theme
  const bodyColor = isDark ? "#fff" : "#000"; // Rick: White in dark mode, Black in light mode
  const accentColor = "#4F8EF7"; // Ride: Always blue
  
  return (
    <span className={className} style={{ display: "inline-block" }}>
      <div className="flex items-center font-bold text-xl">
        <span className={isDark ? "text-white" : "text-black"}>Rick</span>
        <span className="text-[#4F8EF7]">Ride</span>
      </div>
    </span>
  );
}
