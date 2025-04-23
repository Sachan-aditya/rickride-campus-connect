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
import RideCard from "@/components/rides/ride-card";

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
  
  // Only show ongoing ride on student dashboard
  let ongoingRide: Ride | null = null;
  if (user && user.role === "student") {
    const allRides = JSON.parse(localStorage.getItem('rides') || '[]');
    ongoingRide = allRides.find((ride: Ride) =>
      ride.riders.includes(user.id) &&
      (ride.status === "ongoing" || ride.status === "pending" || ride.status === "accepted")
    ) || null;
  }

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
  
  if (user.role === 'driver') {
    return (
      <div className="min-h-screen transition-colors duration-200">
        <Navbar />
        <main className="container mx-auto px-2 md:px-4 pt-20 md:pt-24 max-w-2xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Driver Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
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

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen transition-colors duration-200">
        <Navbar />
        <main className="container mx-auto px-2 md:px-4 pt-20 md:pt-24 max-w-2xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                View all rides, live rides, events and more
              </p>
            </div>
            <ThemeToggle className="hidden md:block" />
          </div>
          {/* Add admin features here */}
        </main>
      </div>
    );
  }

  // Student dashboard, only ongoing ride
  return (
    <div className="min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              View your ongoing ride.
            </p>
          </div>
          <ThemeToggle className="hidden md:block" />
        </div>
        <div className="space-y-6 animate-slide-in">
          {ongoingRide ? (
            <RideCard ride={ongoingRide} />
          ) : (
            <div className="glass-card text-center p-8">
              <h2 className="text-lg font-medium text-muted-foreground">
                No ongoing ride found.
              </h2>
            </div>
          )}
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
