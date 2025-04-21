
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navbar from "@/components/layout/navbar";
import RideCard from "@/components/rides/ride-card";
import RequestRideForm from "@/components/rides/request-ride-form";
import { useToast } from "@/hooks/use-toast";
import { Ride, User } from "@/types";

// Mock rides data
const mockRides: Ride[] = [
  {
    id: "r1",
    from: "Hostel A",
    to: "Library",
    status: "ongoing",
    riders: ["user1", "user2", "user3"],
    maxCapacity: 6,
    created: new Date(Date.now() - 10 * 60 * 1000),
    eta: 12,
  },
  {
    id: "r2",
    from: "Main Gate",
    to: "Academic Block",
    status: "ongoing",
    riders: ["user4", "user5"],
    maxCapacity: 6,
    created: new Date(Date.now() - 15 * 60 * 1000),
    eta: 5,
  },
  {
    id: "r3",
    from: "Sports Complex",
    to: "Hostel B",
    status: "pending",
    riders: ["user6"],
    maxCapacity: 6,
    created: new Date(),
  },
  {
    id: "r4",
    from: "Canteen",
    to: "Library",
    status: "pending",
    riders: ["user7", "user8", "user9", "user10"],
    maxCapacity: 6,
    created: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "r5",
    from: "Academic Block",
    to: "Main Gate",
    status: "pending",
    riders: ["user11", "user12"],
    maxCapacity: 6,
    created: new Date(Date.now() - 8 * 60 * 1000),
  },
];

export default function Rides() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
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
  
  useEffect(() => {
    // Filter and sort rides when tab, rides, or sort method changes
    filterAndSortRides();
  }, [activeTab, rides, sortBy]);
  
  const filterAndSortRides = () => {
    let filtered = [...rides];
    
    // Filter by tab
    if (activeTab === "ongoing") {
      filtered = filtered.filter(ride => ride.status === "ongoing");
    } else if (activeTab === "available") {
      filtered = filtered.filter(ride => ride.status === "pending");
    }
    
    // Sort rides
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.riders.length - a.riders.length);
    }
    
    setFilteredRides(filtered);
  };
  
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
  
  const handleViewLiveRide = (ride: Ride) => {
    navigate('/live-ride');
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] pb-20 md:pb-6">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Campus Rides
            </h1>
            <p className="text-gray-400 mt-1">
              Find and join rickshaw rides around campus
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/20">
                  <Filter className="h-4 w-4 mr-2" />
                  {sortBy === "latest" ? "Latest" : "Popular"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("latest")}>
                  Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popular")}>
                  Popular
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              className="bg-rickride-blue hover:bg-rickride-blue/90"
              onClick={() => setIsRequestModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Request Ride
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="animate-slide-in">
          <TabsList className="mb-6 bg-rickride-darkGray/50">
            <TabsTrigger value="all">All Rides</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRides.map((ride) => (
                <RideCard 
                  key={ride.id} 
                  ride={ride} 
                  onJoin={ride.status === "pending" ? handleJoinRide : undefined} 
                  onCancel={ride.status === "pending" ? handleCancelRide : undefined} 
                />
              ))}
              {filteredRides.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No rides found</h3>
                  <p className="text-gray-400">
                    {activeTab === "ongoing" 
                      ? "There are no ongoing rides at the moment." 
                      : activeTab === "available"
                        ? "There are no available rides to join." 
                        : "There are no rides to display."}
                  </p>
                  
                  <Button 
                    className="bg-rickride-blue hover:bg-rickride-blue/90 mt-4"
                    onClick={() => setIsRequestModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Request Ride
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <RequestRideForm 
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSubmit={handleRequestRide}
      />
    </div>
  );
}
