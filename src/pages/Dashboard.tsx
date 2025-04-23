import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, TrendingUp, Users, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import RequestRideForm from "@/components/rides/request-ride-form";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Ride, User } from "@/types";
import DriverDashboard from "@/components/driver/driver-dashboard";

const popularDestinations = [
  { id: "d1", name: "Library", count: 24 },
  { id: "d2", name: "Canteen", count: 18 },
  { id: "d3", name: "Sports Complex", count: 12 },
];

export default function Dashboard() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userString));
    
    // Initialize rides in localStorage if not present
    if (!localStorage.getItem('rides')) {
      localStorage.setItem('rides', JSON.stringify([]));
    }
  }, [navigate]);
  
  const handleRequestRide = (values: any) => {
    // Get the full location names
    const getLocationName = (value: string) => {
      return value
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    // Create a new ride
    const newRide: Ride = {
      id: `r${Date.now()}`,
      from: getLocationName(values.from),
      to: getLocationName(values.to),
      status: "pending",
      riders: user ? [user.id] : [],
      maxCapacity: 6,
      created: new Date(),
    };
    
    // Save to local storage
    const currentRides = JSON.parse(localStorage.getItem('rides') || '[]');
    const updatedRides = [newRide, ...currentRides];
    localStorage.setItem('rides', JSON.stringify(updatedRides));
    setRides(updatedRides);
    
    toast({
      title: "Ride requested!",
      description: `Your ride from ${newRide.from} to ${newRide.to} has been requested`,
      variant: "default",
    });
  };
  
  if (!user) return null;
  
  // If user is a driver, show driver dashboard
  if (user.role === 'driver') {
    return (
      <div className="min-h-screen bg-[#F6F8FA] pb-20 md:pb-6">
        <Navbar />
        <main className="container mx-auto px-2 md:px-4 pt-20 md:pt-24 max-w-2xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black">
                Driver Dashboard
              </h1>
              <p className="text-gray-700 mt-1 text-lg">
                Manage ride requests
              </p>
            </div>
            <ThemeToggle className="hidden md:block" />
          </div>
          <div className="space-y-6">
            <DriverDashboard />
          </div>
        </main>
      </div>
    );
  }
  
  // For students and other users, show regular dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] via-[#181B37] to-[#1E1E1E] pb-20 md:pb-6">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Hey {user.name.split(' ')[0]}! <span className="text-[#4F8EF7]">Where to today?</span>
            </h1>
            <p className="text-gray-300 mt-1 text-lg">
              Request a rickshaw ride within campus
            </p>
          </div>
          <ThemeToggle className="hidden md:block" />
        </div>
        
        <div className="space-y-6 animate-slide-in">
          <Card className="glass-card bg-[#18203380] backdrop-blur-md border border-[#4F8EF7]/20 rounded-2xl shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Request a Ride</h2>
                  <p className="text-gray-300 text-sm">
                    Need a rickshaw? Make a request now
                  </p>
                </div>
                
                <Button 
                  className="bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 w-full sm:w-auto rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 hover:scale-105"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Request Ride
                </Button>
              </div>
              
              <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-[#4F8EF7]" />
                  <h3 className="font-medium text-white text-lg">Popular Destinations Today</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      className="p-4 bg-[#1A1F2C] border border-white/5 rounded-xl hover:bg-[#232939] hover:border-[#4F8EF7]/30 transition-all duration-300 text-left group"
                      onClick={() => {
                        setIsRequestModalOpen(true);
                      }}
                    >
                      <div className="font-medium text-white group-hover:text-[#4F8EF7] transition-colors">{dest.name}</div>
                      <div className="flex items-center text-sm text-gray-300 mt-1">
                        <Users className="h-3.5 w-3.5 mr-1.5 text-[#4F8EF7]" /> 
                        <span>{dest.count} rides today</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <RequestRideForm 
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSubmit={handleRequestRide}
      />
    </div>
  );
}
