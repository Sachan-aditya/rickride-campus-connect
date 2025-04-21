
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/register-form";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function Register() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#121212] to-[#1E1E1E] p-6">
      <ThemeToggle />
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">RickRide</h1>
          <p className="text-gray-400">Your campus rickshaw and events companion</p>
        </div>
        
        <div className="glass-card rounded-xl p-6 backdrop-blur-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Create an account</h2>
          <RegisterForm />
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-8">
          RickRide &copy; {new Date().getFullYear()} - Campus Mobility Solution
        </p>
      </div>
    </div>
  );
}
