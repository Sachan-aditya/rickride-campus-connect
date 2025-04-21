
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import RideCard from "@/components/rides/ride-card";
import RequestRideForm from "@/components/rides/request-ride-form";
import { useToast } from "@/hooks/use-toast";
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
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] pb-20 md:pb-6">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Hey {user.name.split(' ')[0]}! Where to today?
          </h1>
          <p className="text-gray-400 mt-1">
            Request or join a rickshaw ride within campus
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6 animate-slide-in">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Request a Ride</h2>
                    <p className="text-gray-400 text-sm">
                      Need a rickshaw? Make a request now
                    </p>
                  </div>
                  
                  <Button 
                    className="bg-rickride-blue hover:bg-rickride-blue/90 w-full sm:w-auto"
                    onClick={() => setIsRequestModalOpen(true)}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Request Ride
                  </Button>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-rickride-blue" />
                    <h3 className="font-medium text-white">Popular Destinations Today</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {popularDestinations.map((dest) => (
                      <button
                        key={dest.id}
                        className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors text-left"
                        onClick={() => {
                          setIsRequestModalOpen(true);
                        }}
                      >
                        <div className="font-medium text-white">{dest.name}</div>
                        <div className="text-xs text-gray-400">{dest.count} rides today</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Ongoing Ride Groups</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rides.filter(ride => ride.status === 'ongoing').map((ride) => (
                  <RideCard 
                    key={ride.id} 
                    ride={ride}
                  />
                ))}
                {rides.filter(ride => ride.status === 'ongoing').length === 0 && (
                  <p className="text-gray-400 md:col-span-2">No ongoing rides at the moment</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Available Ride Groups</h2>
            <div className="space-y-4">
              {rides.filter(ride => ride.status === 'pending').map((ride) => (
                <RideCard 
                  key={ride.id} 
                  ride={ride}
                  onJoin={handleJoinRide}
                  onCancel={handleCancelRide}
                />
              ))}
              {rides.filter(ride => ride.status === 'pending').length === 0 && (
                <p className="text-gray-400">No available rides at the moment</p>
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
