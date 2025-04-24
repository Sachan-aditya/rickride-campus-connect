
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/register-form";
import ThemeToggle from "@/components/ui/theme-toggle";
import RickRideLogo from "@/components/ui/rickride-logo";

export default function Register() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => 
    document.documentElement.classList.contains("dark")
  );

  // Use useCallback to prevent the function from being recreated on each render
  const handler = useCallback(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }

    // Theme listener for logo coloring
    handler();
    window.addEventListener("click", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [navigate, handler]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 
      bg-gradient-to-b ${isDark
        ? "from-[#121212] to-[#1E1E1E]"
        : "from-[#eaf2fa] to-[#f8fafc]"}
      transition-colors duration-300`}>
      <div className="absolute top-5 right-6">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <RickRideLogo theme={isDark ? "dark" : "light"} size={60} className="mb-2" />
          <h1 className={`text-4xl font-bold mb-1 
            ${isDark ? "text-white" : "text-[#4F8EF7]"}`}>RickRide</h1>
          <p className={`text-gray-400 ${isDark ? "" : "text-gray-600"}`}>
            Your campus rickshaw and events companion
          </p>
        </div>
        
        <div className={`glass-card rounded-2xl p-8 backdrop-blur-lg shadow-2xl ${
          isDark ? "bg-rickride-card" : "bg-white/70 border border-[#e4eaff] shadow-blue-100"
        } transition-colors`}>
          <h2 className={`text-xl font-semibold mb-7
            ${isDark ? "text-white" : "text-[#181b37]"}`}>Create an account</h2>
          <RegisterForm isDark={isDark} />
        </div>
        
        <p className={`text-center text-gray-500 text-sm mt-8 ${
          !isDark ? "text-gray-400" : ""}`}>
          RickRide &copy; {new Date().getFullYear()} - Campus Mobility Solution
        </p>
      </div>
    </div>
  );
}
