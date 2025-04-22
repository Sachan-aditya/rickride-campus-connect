
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, User, Users, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Ride, User as UserType } from "@/types";

// Mock data for a live ride
const mockLiveRide: Ride = {
  id: "live1",
  from: "Hostel A",
  to: "Library",
  status: "ongoing",
  driverId: "driver1",
  riders: ["user1", "user2", "user3", "user4", "user5", "user6"],
  maxCapacity: 6,
  created: new Date(Date.now() - 15 * 60 * 1000),
  startTime: new Date(Date.now() - 5 * 60 * 1000),
  eta: 8,
  location: {
    lat: 28.5456,
    lng: 77.2731,
  },
};

// Mock driver data
const mockDriver = {
  id: "driver1",
  name: "Rakesh Kumar",
  phone: "+91 9876543210",
  rating: 4.8,
  ridesCompleted: 143,
  vehicleNumber: "DL 01 RK 4567",
  vehicleColor: "Yellow",
};

// Mock riders
const mockRiders = [
  { id: "user1", name: "Aditya Kumar", profilePicture: null },
  { id: "user2", name: "Priya Sharma", profilePicture: null },
  { id: "user3", name: "Rahul Singh", profilePicture: null },
  { id: "user4", name: "Neha Gupta", profilePicture: null },
  { id: "user5", name: "Vikram Patel", profilePicture: null },
  { id: "user6", name: "Sanjana Verma", profilePicture: null },
];

export default function LiveRide() {
  const [ride, setRide] = useState<Ride | null>(null);
  const [progress, setProgress] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(mockLiveRide.eta || 0);
  const [user, setUser] = useState<UserType | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userString));
    
    // Load mock ride data
    setRide(mockLiveRide);
    
    // Simulate ride progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
      
      setTimeRemaining((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    // Simulate map loading with a marker
    if (mapRef.current) {
      // In a real implementation, this would initialize a map library like Google Maps or Mapbox
      const mapElement = mapRef.current;
      mapElement.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="relative">
              <div class="w-4 h-4 bg-rickride-blue rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="w-8 h-8 bg-rickride-blue opacity-30 rounded-full animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <path d="M10,100 L50,50 L100,10 L150,50 L190,100 L150,150 L100,190 L50,150 Z" 
                      fill="none" stroke="#4B5563" stroke-width="1" />
                <path d="M30,100 L60,60 L100,30 L140,60 L170,100 L140,140 L100,170 L60,140 Z" 
                      fill="none" stroke="#4B5563" stroke-width="1" />
                <path d="M50,100 L70,70 L100,50 L130,70 L150,100 L130,130 L100,150 L70,130 Z" 
                      fill="none" stroke="#4B5563" stroke-width="1" />
                <circle cx="100" cy="100" r="5" fill="#3B82F6" />
              </svg>
              <div class="absolute bottom-0 left-0 right-0 mt-2 text-white">Current Location</div>
            </div>
          </div>
        </div>
      `;
    }
    
    return () => clearInterval(interval);
  }, [navigate]);
  
  const handleLeaveRide = () => {
    toast({
      title: "Left ride",
      description: "You have left the current ride",
    });
    navigate('/dashboard');
  };
  
  const handleRideComplete = () => {
    toast({
      title: "Ride completed",
      description: "Thank you for using RickRide!",
    });
    navigate('/dashboard');
  };
  
  const handleCallDriver = () => {
    toast({
      title: "Calling driver",
      description: `Connecting call to ${mockDriver.name}...`,
    });
  };
  
  const handleMessageDriver = () => {
    toast({
      title: "Message sent",
      description: "Your driver will receive your message shortly",
    });
  };
  
  if (!ride || !user) return null;
  
  const formatTimeRemaining = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  const isFull = ride.riders.length >= ride.maxCapacity;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] pb-20 md:pb-6">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Live Ride Tracking
          </h1>
          <p className="text-gray-400 mt-1">
            Track your current rickshaw ride in real-time
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-slide-in">
            {/* Map view */}
            <div className="aspect-[16/9] bg-rickride-darkGray rounded-xl overflow-hidden relative">
              <div ref={mapRef} className="absolute inset-0"></div>
              
              {/* Map overlay with current ride status */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-white font-medium">Current Trip</h3>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-rickride-blue" />
                      {ride.from} to {ride.to}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {formatTimeRemaining(timeRemaining)} min
                    </div>
                    <div className="text-gray-300 text-sm">remaining</div>
                  </div>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardContent className="p-5">
                  <h3 className="text-lg font-medium text-white mb-4">Rickshaw & Driver</h3>
                  
                  <div className="flex items-center">
                    <Avatar className="h-14 w-14 mr-4 bg-rickride-blue/30">
                      <AvatarFallback className="text-white">
                        {mockDriver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{mockDriver.name}</h4>
                      <div className="text-sm text-gray-400">{mockDriver.phone}</div>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center text-yellow-400 mr-3">
                          <svg className="w-4 h-4 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {mockDriver.rating}
                        </div>
                        <div className="text-gray-400 text-sm">{mockDriver.ridesCompleted} rides</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-yellow-400 font-medium">{mockDriver.vehicleNumber}</div>
                        <div className="text-sm text-gray-400">{mockDriver.vehicleColor} Rickshaw</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-600/90 w-10 h-10 p-0"
                          onClick={handleCallDriver}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-rickride-blue hover:bg-rickride-blue/90 w-10 h-10 p-0"
                          onClick={handleMessageDriver}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Passengers</h3>
                    <div className="text-sm text-gray-400">
                      <Users className="h-4 w-4 inline mr-1" />
                      {ride.riders.length}/{ride.maxCapacity}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {mockRiders.map((rider) => (
                      <div key={rider.id} className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2 bg-rickride-blue/30">
                          <AvatarFallback className="text-white">
                            {rider.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-white text-sm">{rider.name}</div>
                      </div>
                    ))}
                  </div>
                  
                  {isFull && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-center text-green-400 text-sm">
                        Rickshaw is full, departing soon!
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <h3 className="text-lg font-medium text-white mb-4">Ride Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Pick-up</div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-rickride-blue mt-0.5 mr-2" />
                      <div>
                        <div className="text-white">{ride.from}</div>
                        <div className="text-sm text-gray-400">
                          {ride.startTime ? new Date(ride.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Destination</div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-white mt-0.5 mr-2" />
                      <div>
                        <div className="text-white">{ride.to}</div>
                        <div className="text-sm text-gray-400">
                          Estimated arrival: {formatTimeRemaining(timeRemaining)} min
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm text-gray-400 mb-1">Status</div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-400 mr-2" />
                      <div className="text-green-400">En Route</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                    onClick={handleLeaveRide}
                    disabled={isFull}
                  >
                    {isFull ? "Can't Leave (Full)" : "Leave Ride"}
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-600/90"
                    onClick={handleRideComplete}
                  >
                    Ride Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card mt-6">
              <CardContent className="p-5">
                <h3 className="text-lg font-medium text-white mb-4">Safety Tips</h3>
                
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex">
                    <span className="text-green-400 mr-2">•</span>
                    Verify your driver's identity before boarding
                  </li>
                  <li className="flex">
                    <span className="text-green-400 mr-2">•</span>
                    Share your ride details with friends or family
                  </li>
                  <li className="flex">
                    <span className="text-green-400 mr-2">•</span>
                    Report any issues immediately to campus security
                  </li>
                  <li className="flex">
                    <span className="text-green-400 mr-2">•</span>
                    Ensure the rickshaw is not overloaded beyond capacity
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
