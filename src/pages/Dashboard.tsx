import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, TrendingUp, Users, Clock, Navigation, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import RideCard from "@/components/rides/ride-card";
import RequestRideForm from "@/components/rides/request-ride-form";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Ride, User } from "@/types";

const popularDestinations = [
  { id: "d1", name: "Library", count: 24 },
  { id: "d2", name: "Canteen", count: 18 },
  { id: "d3", name: "Sports Complex", count: 12 },
];

// Mock data for available rides
const mockRides: Ride[] = [
  {
    id: "r1",
    from: "Hostel A",
    to: "Library",
    status: "pending",
    riders: ["user1", "user2"],
    maxCapacity: 6,
    created: new Date(),
  },
  {
    id: "r2",
    from: "Main Gate",
    to: "Academic Block",
    status: "ongoing",
    riders: ["user3", "user4", "user5"],
    maxCapacity: 6,
    created: new Date(Date.now() - 10 * 60 * 1000),
    eta: 8,
  },
  {
    id: "r3",
    from: "Canteen",
    to: "Hostel B",
    status: "pending",
    riders: ["user6"],
    maxCapacity: 6,
    created: new Date(Date.now() - 5 * 60 * 1000),
  },
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
    
    // Load mock rides
    setRides(mockRides);
  }, [navigate]);
  
  const handleJoinRide = (ride: Ride) => {
    // In a real app, this would call an API
    const updatedRides = rides.map((r) => {
      if (r.id === ride.id && user) {
        return {
          ...r,
          riders: [...r.riders, user.id],
        };
      }
      return r;
    });
    
    setRides(updatedRides);
    
    toast({
      title: "Ride joined!",
      description: `You've joined the ride from ${ride.from} to ${ride.to}`,
    });
  };
  
  const handleCancelRide = (ride: Ride) => {
    toast({
      title: "Ride cancelled",
      description: "The ride request has been cancelled",
    });
  };
  
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
    
    setRides([newRide, ...rides]);
    
    toast({
      title: "Ride requested!",
      description: `Your ride from ${newRide.from} to ${newRide.to} has been requested`,
      variant: "default",
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] via-[#181B37] to-[#1E1E1E] pb-20 md:pb-6">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Hey {user.name.split(' ')[0]}! <span className="text-[#4F8EF7]">Where to today?</span>
            </h1>
            <p className="text-gray-400 mt-1 text-lg">
              Request or join a rickshaw ride within campus
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
                  <p className="text-gray-400 text-sm">
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
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Users className="h-3.5 w-3.5 mr-1.5 text-[#4F8EF7]" /> 
                        <span>{dest.count} rides today</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-[#4F8EF7]" />
              Ongoing Ride Groups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rides.filter(ride => ride.status === 'ongoing').map((ride) => (
                <RideCard 
                  key={ride.id} 
                  ride={ride}
                />
              ))}
              {rides.filter(ride => ride.status === 'ongoing').length === 0 && (
                <div className="md:col-span-2 flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-[#18203380] backdrop-blur-md border border-[#4F8EF7]/10">
                  <Navigation className="h-12 w-12 text-[#4F8EF7]/40 mb-3" />
                  <p className="text-gray-400 text-center text-lg">No ongoing rides at the moment</p>
                  <p className="text-gray-500 text-center text-sm mt-1">Be the first to request a ride!</p>
                </div>
              )}
            </div>
          </div>
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
