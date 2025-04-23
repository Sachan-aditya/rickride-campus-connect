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
    riders: ["user1", "user2", "user3", "user4", "user5", "user6"],
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
    riders: ["user7", "user8", "user9", "user10", "user11"],
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
    if (!user) return;
    // Student: see only their history (rides previously completed)
    if (user.role === "student") {
      setFilteredRides(rides.filter(r => r.riders.includes(user.id) && r.status === "completed"));
    } else if (user.role === "driver") {
      // Driver: only completed rides by them
      setFilteredRides(rides.filter(r => r.driverId === user.id && r.status === "completed"));
    } else if (user.role === "admin") {
      // Admin: all rides
      setFilteredRides(rides);
    }
  }, [activeTab, rides, sortBy, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F8FA] to-[#E5EDFB] dark:from-[#232d3b] dark:to-[#1B2533] pb-20 md:pb-6 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              All Rides
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {user.role === "student" ? 'See your past completed rides' : 'All rides in system'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No rides found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No rides to display.
              </p>
            </div>
          )}
        </div>
        {/* Request Ride button only for students */}
        {user.role === "student" && (
          <Button
            className="bg-[#4F8EF7] hover:bg-[#3f7ada] mt-8"
            onClick={() => setIsRequestModalOpen(true)}
          >
            Request Ride
          </Button>
        )}
      </main>
      <RequestRideForm
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSubmit={(values: any) => {
          // Only students can request
          if (user?.role !== "student") {
            toast({
              title: "Action not allowed",
              description: "Only students can request new rides.",
              variant: "destructive",
            });
            return;
          }
          // Get the full location names from values
          const getLocationName = (value: string) => {
            return value
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          };
          
          const newRide: Ride = {
            id: `r${Date.now()}`,
            from: getLocationName(values.from),
            to: getLocationName(values.to),
            status: "pending",
            riders: [user.id],
            maxCapacity: 6,
            created: new Date(),
          };
          
          setRides([newRide, ...rides]);
          
          toast({
            title: "Ride requested!",
            description: "Your ride request has been created successfully",
          });
        }}
      />
    </div>
  );
}
