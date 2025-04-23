
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import RideCard from "@/components/rides/ride-card";
import ProfileForm from "@/components/profile/profile-form";
import { User, Ride } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<User | null>(null);
  const [pastRides, setPastRides] = useState<Ride[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userString);
    setUser(parsedUser);
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    // For students, only show their ride history.
    if (parsedUser.role === 'student') {
      const userPastRides = rides.filter((ride: Ride) => ride.riders && ride.riders.includes(parsedUser.id));
      setPastRides(userPastRides);
    } else if (parsedUser.role === 'driver') {
      // For drivers, just show all their rides.
      const driverRides = rides.filter((ride: Ride) => ride.driverId === parsedUser.id);
      setPastRides(driverRides);
    } else if (parsedUser.role === 'admin') {
      // For admins, show all rides.
      setPastRides(rides);
    }
  }, [navigate]);
  
  const handleUpdateProfile = (updatedUser: User) => {
    const updatedUserData = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-20">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and view your ride history
          </p>
        </div>
        <Card className="glass-card">
          <CardContent className="p-6">
            <ProfileForm user={user} onSave={handleUpdateProfile} />
          </CardContent>
        </Card>
        <Card className="glass-card mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Ride History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastRides.length > 0 ? (
                pastRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))
              ) : (
                <p className="text-muted-foreground md:col-span-2">You don't have any previous rides.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
