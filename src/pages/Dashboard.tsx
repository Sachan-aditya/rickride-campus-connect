
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestRideForm from "@/components/rides/request-ride-form";
import { useToast } from "@/hooks/use-toast";
import { Ride, User } from "@/types";
import RideCard from "@/components/rides/ride-card";
import { Button } from "@/components/ui/button";

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

  let ongoingRide: Ride | null = null;
  if (user && user.role === "student") {
    const allRides = JSON.parse(localStorage.getItem('rides') || '[]');
    ongoingRide = allRides.find((ride: Ride) =>
      ride.riders.includes(user.id) &&
      (ride.status === "ongoing" || ride.status === "pending" || ride.status === "accepted")
    ) || null;
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen transition-colors duration-200 flex flex-col overflow-hidden">
      {/* Animated background is kept */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-80 h-80 top-[-100px] right-[-80px] bg-gradient-to-br from-blue-300/60 via-[#4F8EF7]/30 to-white/10 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute w-72 h-72 bottom-[-110px] left-[-60px] bg-gradient-to-bl from-blue-200/60 via-blue-100/40 to-white/10 rounded-full blur-3xl opacity-60 animate-pulse delay-100" />
        <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-white/5 to-transparent dark:from-[#1E1E1E]/60 dark:via-[#121212]/60 dark:to-transparent" />
        <div className="absolute top-24 left-[25%] w-40 h-40 bg-gradient-to-tr from-blue-200/25 via-white/25 to-blue-200/25 rounded-full blur-2xl opacity-30 animate-pulse-slow" />
        <div className="absolute top-2/3 right-[10%] w-24 h-24 bg-gradient-to-br from-blue-400/15 to-white/10 rounded-full blur-xl opacity-30 animate-pulse-slow" />
      </div>
      {/* RickRide logo at the top center -- REMOVED as requested */}
      {/* <header className="w-full flex justify-center py-8 select-none z-30">
        <RickRideGradientLogo size={44} />
      </header> */}
      <main className="container mx-auto px-4 pt-0 flex-1 z-10 flex flex-col justify-center">
        <div className="mb-8 animate-fade-in flex flex-col items-center justify-center">
          <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-blue-400 to-white bg-clip-text text-transparent text-center">
            {user && (
              <>
                Welcome back, <span className="font-extrabold">{user.name}</span>!
              </>
            )}
          </h2>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent mt-1 text-center">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-lg text-center">
            {ongoingRide ? "View your ongoing ride." : "You have no ongoing ride."}
          </p>
        </div>
        {/* Request Ride Button */}
        <div className="flex justify-center mb-8">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg text-lg shadow"
            onClick={() => setIsRequestModalOpen(true)}
          >
            Request Ride
          </Button>
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
      {/* Footer with emoji and correct text */}
      <footer className="w-full text-center pb-6 pt-4 text-gray-500 text-base opacity-75 z-10">
        <span>
          Made with <span className="text-red-400">❤️</span> by <span className="font-semibold text-blue-600">ADITYA SACHAN</span>
        </span>
      </footer>
      <RequestRideForm
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSubmit={() => {}}
      />
    </div>
  );
}
