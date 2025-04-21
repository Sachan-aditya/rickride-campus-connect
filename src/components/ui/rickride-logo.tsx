
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
  // Primary logo color is electric blue, light mode should swap to dark
  const color = theme === "light" ? "#4F8EF7" : "#EEEEEE";
  const stroke = theme === "light" ? "#121212" : "#4F8EF7";

  return (
    <span className={className} style={{ display: "inline-block" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="RickRide"
      >
        {/* Main circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill={theme === "light" ? "#fff" : "#121212"}
          stroke={color}
          strokeWidth="3"
          opacity="0.95"
        />
        {/* Rickshaw main body */}
        <rect
          x="12"
          y="18"
          width="20"
          height="8"
          rx="3"
          fill={color}
          stroke={stroke}
          strokeWidth="1.5"
          opacity="1"
        />
        {/* Wheels */}
        <circle
          cx="16"
          cy="29"
          r="2"
          fill={theme === "light" ? "#222" : "#EEEEEE"}
        />
        <circle
          cx="28"
          cy="29"
          r="2"
          fill={theme === "light" ? "#222" : "#EEEEEE"}
        />
        {/* Window */}
        <rect
          x="17"
          y="19"
          width="10"
          height="4"
          rx="1"
          fill={theme === "light" ? "#e3f0fc" : "#222B"}
          stroke={stroke}
          strokeWidth="0.8"
        />
      </svg>
    </span>
  );
}

