
import React from "react";

interface RickRideGradientLogoProps {
  className?: string;
  size?: number;
}

export default function RickRideGradientLogo({ className = "", size = 32 }: RickRideGradientLogoProps) {
  // Gradient is now blue and white only
  return (
    <span
      className={`font-extrabold tracking-widest bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent ${className}`}
      style={{ fontSize: size, letterSpacing: '0.12em'}}
    >
      RickRide
    </span>
  );
}
