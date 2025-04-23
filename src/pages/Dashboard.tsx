
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import RequestRideForm from "@/components/rides/request-ride-form";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Ride, User } from "@/types";
import RideCard from "@/components/rides/ride-card";

export default function Dashboard() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userString));
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

  if (!user) return null;

  // Dashboard for STUDENT only, as DRIVER and ADMIN split removed
  return (
    <div className="relative min-h-screen transition-colors duration-200 flex flex-col overflow-hidden">
      <Navbar />
      {/* Glass morph animated background with live animated shapes */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Animated color blobs for glass morph effect */}
        <div className="absolute w-80 h-80 top-[-100px] right-[-80px] bg-gradient-to-br from-blue-300/60 via-[#4F8EF7]/30 to-purple-300/10 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute w-72 h-72 bottom-[-110px] left-[-60px] bg-gradient-to-bl from-purple-200/60 via-blue-100/40 to-blue-200/10 rounded-full blur-3xl opacity-60 animate-pulse delay-100" />
        <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-white/5 to-transparent dark:from-[#1E1E1E]/60 dark:via-[#121212]/60 dark:to-transparent" />
        {/* More subtle animated circles/shapes for "live" effect */}
        <div className="absolute top-24 left-[25%] w-40 h-40 bg-gradient-to-tr from-blue-200/25 via-purple-100/25 to-pink-200/25 rounded-full blur-2xl opacity-30 animate-pulse-slow" />
        <div className="absolute top-2/3 right-[10%] w-24 h-24 bg-gradient-to-br from-pink-400/15 to-blue-200/10 rounded-full blur-xl opacity-30 animate-pulse-slow" />
      </div>
      <main className="container mx-auto px-4 pt-28 flex-1 z-10 flex flex-col justify-center">
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-end justify-between">
          <div>
            {/* Welcome back message */}
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {user && `Welcome back, ${user.name}!`}
            </h2>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-400 to-purple-400 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-200 dark:to-purple-200 mt-1">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {ongoingRide ? "View your ongoing ride." : "You have no ongoing ride."}
            </p>
          </div>
        </div>
        <div className="space-y-6 animate-slide-in">
          {ongoingRide ? (
            <RideCard ride={ongoingRide} />
          ) : (
            <div className="glass-card text-center p-8 animate-fade-in">
              <h2 className="text-lg font-medium text-muted-foreground">
                No ongoing ride found.
              </h2>
            </div>
          )}
        </div>
      </main>
      {/* FOOTER */}
      <footer className="w-full text-center pb-6 pt-4 text-gray-500 text-sm opacity-75 z-10">
        <span>
          Made with <span className="text-red-400">&hearts;</span> <span className="font-semibold">ADITYA SACHAN</span>
        </span>
      </footer>
      <RequestRideForm
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSubmit={() => {}} // Remove "request ride" UI for now
      />
    </div>
  );
}
