
import React from "react";

interface RickRideGradientLogoProps {
  className?: string;
  size?: number;
}

export default function RickRideGradientLogo({ className = "", size = 32 }: RickRideGradientLogoProps) {
  // Uses a gradient text class and can be resized
  return (
    <span
      className={`font-extrabold tracking-widest bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 bg-clip-text text-transparent ${className}`}
      style={{ fontSize: size, letterSpacing: '0.12em'}}
    >
      RickRide
    </span>
  );
}
