
import React from "react";

interface RickRideLogoProps {
  theme?: "light" | "dark";
  className?: string;
  size?: number;
}

export default function RickRideLogo({
  theme = "dark",
  className = "",
  size = 44,
}: RickRideLogoProps) {
  // For requested blue/white accent and better match for dark/light backgrounds
  const isDark = theme === "dark";
  const rimColor = isDark ? "#4F8EF7" : "#1EAEDB";
  const fillBg = isDark ? "#181b37" : "#fff";
  const bodyColor = isDark ? "#fff" : "#2676e7";
  const wheelColor = isDark ? "#4F8EF7" : "#1EAEDB";
  const windowFill = isDark ? "#2c355a" : "#e4f0ff";
  const stroke = isDark ? "#1EAEDB" : "#2676e7";

  return (
    <span className={className} style={{ display: "inline-block" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="RickRide"
        style={{
          filter: isDark
            ? "drop-shadow(0 0 10px #4F8EF7cc)"
            : "drop-shadow(0 0 6px #aee2fd88)",
          background: "transparent",
        }}
      >
        {/* Main circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill={fillBg}
          stroke={rimColor}
          strokeWidth="3.5"
          opacity="1"
        />
        {/* Rickshaw body */}
        <rect
          x="12"
          y="18"
          width="20"
          height="8"
          rx="3"
          fill={bodyColor}
          stroke={stroke}
          strokeWidth="2"
        />
        {/* Wheels */}
        <circle
          cx="16"
          cy="29"
          r="2.2"
          fill={wheelColor}
        />
        <circle
          cx="28"
          cy="29"
          r="2.2"
          fill={wheelColor}
        />
        {/* Window */}
        <rect
          x="17"
          y="19"
          width="10"
          height="4"
          rx="1"
          fill={windowFill}
          stroke={stroke}
          strokeWidth="1"
        />
      </svg>
    </span>
  );
}
