
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/login-form";
import ThemeToggle from "@/components/ui/theme-toggle";
import RickRideLogo from "@/components/ui/rickride-logo";

export default function Login() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // Use useCallback to prevent the function from being recreated on each render
  const themeHandler = useCallback(() =>
    setIsDark(document.documentElement.classList.contains("dark")),
  []);

  useEffect(() => {
    // Redirect if already logged in
    const user = localStorage.getItem('user');
    if (user) navigate('/dashboard');

    // Theme listener for logo
    themeHandler();
    window.addEventListener("click", themeHandler);
    window.addEventListener("keydown", themeHandler);
    return () => {
      window.removeEventListener("click", themeHandler);
      window.removeEventListener("keydown", themeHandler);
    };
  }, [navigate, themeHandler]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-6 px-4 
      transition-colors duration-300
      ${isDark
        ? "bg-gradient-to-b from-[#121212] via-[#181B37] to-[#1b263b]"
        : "bg-gradient-to-br from-[#eaf2fa] via-[#e9f2fb] to-[#f8fafc]"}
    `}>
      <div className="absolute top-5 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand */}
        <div className="flex flex-col items-center mb-7">
          <RickRideLogo
            theme={isDark ? "dark" : "light"}
            size={64}
            className="mb-3 animate-fade-in"
          />
          <h1
            className={`font-poppins text-4xl font-extrabold tracking-tight leading-tight mb-2 
            ${isDark ? "text-white" : "text-[#2676E7]"} drop-shadow`}
          >
            RickRide
          </h1>
          <span className={`
            text-[1.08rem] font-medium 
            ${isDark ? "text-[#c9e5ffbe]" : "text-[#548ded]"}
            text-center w-full
          `}>
            Your campus rickshaw & events companion
          </span>
        </div>
        {/* Login Glass Card */}
        <div className={`glass-card rounded-3xl py-10 px-7 shadow-2xl border-2
          ${isDark
            ? "bg-[#182033cf] border-[#366cc9a0] shadow-blue-900/40"
            : "bg-white/95 border-[#b1cffb] shadow-blue-100"}
          transition-all duration-300
        `}>
          <h2 className={`font-bold text-2xl md:text-2xl text-center mb-7 tracking-tight ${isDark ? "text-white" : "text-[#202a51]"}`}>
            Sign in to RickRide
          </h2>
          <LoginForm />
        </div>
        <p className={`text-center text-xs mt-8 opacity-90
          ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          &copy; {new Date().getFullYear()} RickRide - Campus Mobility Solution
        </p>
      </div>
    </div>
  );
}
