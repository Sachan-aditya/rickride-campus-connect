
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import RequestRideForm from "@/components/rides/request-ride-form";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Ride } from "@/types";
import DriverDashboard from "@/components/driver/driver-dashboard";
import RideCard from "@/components/rides/ride-card";
import { useAuth } from "@/context/auth-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Initialize rides in localStorage if not present
      if (!localStorage.getItem('rides')) {
        localStorage.setItem('rides', JSON.stringify([]));
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Only show ongoing ride on student dashboard
  let ongoingRide: Ride | null = null;
  if (user && profile?.role === "student") {
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} text="Loading dashboard..." />
      </div>
    );
  }

  if (!user || !profile) return null;
  
  if (profile.role === 'driver') {
    return (
      <div className="min-h-screen transition-colors duration-200">
        <Navbar />
        <main className="container mx-auto px-2 md:px-4 pt-20 md:pt-24 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col md:flex-row md:items-end justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Driver Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Manage ride requests
              </p>
            </div>
            <ThemeToggle className="hidden md:block" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <DriverDashboard />
          </motion.div>
        </main>
      </div>
    );
  }

  if (profile.role === 'admin') {
    return (
      <div className="min-h-screen transition-colors duration-200">
        <Navbar />
        <main className="container mx-auto px-2 md:px-4 pt-20 md:pt-24 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col md:flex-row md:items-end justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                View all rides, live rides, events and more
              </p>
            </div>
            <ThemeToggle className="hidden md:block" />
          </motion.div>
        </main>
      </div>
    );
  }

  // Student dashboard
  return (
    <div className="min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Welcome, {profile?.name || user.email}
            </p>
          </div>
          <ThemeToggle className="hidden md:block" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 animate-slide-in"
        >
          {ongoingRide ? (
            <RideCard ride={ongoingRide} />
          ) : (
            <div className="glass-card text-center p-8">
              <h2 className="text-lg font-medium text-muted-foreground">
                No ongoing ride found.
              </h2>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Create a new ride request to get started.
              </p>
              
              <Button 
                onClick={() => setIsRequestModalOpen(true)}
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Request a Ride
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <RequestRideForm
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSubmit={handleRequestRide}
      />
    </div>
  );
}
