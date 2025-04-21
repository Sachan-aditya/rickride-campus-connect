
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#121212] to-[#1E1E1E] p-6 relative overflow-hidden">
      <ThemeToggle />
      
      {/* Background elements - purely decorative */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-rickride-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-rickride-red/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center z-10 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          <span className="text-rickride-blue">Rick</span>Ride
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Your campus rickshaw and events companion. Get around campus easily and stay updated with the latest events.
        </p>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-md mx-auto">
          <Button 
            size="lg"
            className="text-lg bg-rickride-blue hover:bg-rickride-blue/90"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
        
        <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3 max-w-4xl">
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-rickride-blue/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-rickride-blue">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Quick Rides</h3>
            <p className="text-gray-400">
              Request or join rickshaw rides across campus with just a few taps.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-rickride-blue/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-rickride-blue">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21v-2a7 7 0 0 0-14 0v2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Group Rides</h3>
            <p className="text-gray-400">
              Share rides with fellow students to save money and reduce wait times.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 bg-rickride-blue/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-rickride-blue">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Campus Events</h3>
            <p className="text-gray-400">
              Discover and join events happening around your campus community.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-4 text-center text-gray-500 text-sm">
        RickRide &copy; {new Date().getFullYear()} - Campus Mobility Solution
      </footer>
    </div>
  );
}
