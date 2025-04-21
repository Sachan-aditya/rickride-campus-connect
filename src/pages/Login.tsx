
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/login-form";
import ThemeToggle from "@/components/ui/theme-toggle";
import RickRideLogo from "@/components/ui/rickride-logo";

export default function Login() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }

    // Theme listener for logo coloring
    const handler = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    handler();
    window.addEventListener("click", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [navigate]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-300
      ${isDark
        ? "bg-gradient-to-br from-[#121212] via-[#1B263B] to-[#202c39]"
        : "bg-gradient-to-br from-[#eaf2fa] to-[#f8fafc]"}`}>
      <ThemeToggle />
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <RickRideLogo theme={isDark ? "dark" : "light"} size={60} className="mb-2" />
          <h1 className={`text-4xl font-extrabold mb-2 tracking-wide
            ${isDark ? "text-white" : "text-[#4F8EF7]"}`}>RickRide</h1>
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>Your campus rickshaw & events companion</p>
        </div>
        <div className={`glass-card rounded-3xl p-8 backdrop-blur-lg shadow-2xl border-2
          ${isDark
            ? "bg-[#18203399] border-[#2768a950] shadow-blue-900/50"
            : "bg-white/70 border-[#e4eaff] shadow-blue-100"}`}>
          <h2 className={`text-2xl font-semibold mb-6 text-center
            ${isDark ? "text-white" : "text-[#181b37]"}`}>Log in to your account</h2>
          <LoginForm />
        </div>
        <p className={`text-center text-gray-500 text-sm mt-8 ${!isDark ? "text-gray-400" : ""}`}>
          RickRide &copy; {new Date().getFullYear()} - Campus Mobility Solution
        </p>
      </div>
    </div>
  );
}
