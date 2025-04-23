
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userString);
    setUser(parsedUser);
    
    // Load rides from localStorage
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    
    if (parsedUser.role === 'student') {
      // For students, filter rides they are part of
      const userRides = rides.filter((ride: Ride) => 
        ride.riders && ride.riders.includes(parsedUser.id)
      );
      
      const userPastRides = userRides.filter((ride: Ride) => 
        ride.status === 'completed'
      );
      
      const userUpcomingRides = userRides.filter((ride: Ride) => 
        ride.status === 'pending' || ride.status === 'accepted'
      );
      
      setPastRides(userPastRides);
      setUpcomingRides(userUpcomingRides);
    } else if (parsedUser.role === 'driver') {
      // For drivers, filter rides they've driven
      const driverPastRides = rides.filter((ride: Ride) => 
        ride.driverId === parsedUser.id && ride.status === 'completed'
      );
      
      const driverUpcomingRides = rides.filter((ride: Ride) => 
        ride.driverId === parsedUser.id && 
        (ride.status === 'accepted' || ride.status === 'ongoing')
      );
      
      setPastRides(driverPastRides);
      setUpcomingRides(driverUpcomingRides);
    }
  }, [navigate]);
  
  const handleUpdateProfile = (updatedUser: User) => {
    // Update user in localStorage
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
            Manage your profile and view your activity
          </p>
        </div>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="animate-slide-in">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="rides">My Rides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <Card className="glass-card">
              <CardContent className="p-6">
                <ProfileForm user={user} onSave={handleUpdateProfile} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rides" className="mt-0">
            <Card className="glass-card mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Rides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingRides.length > 0 ? (
                    upcomingRides.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))
                  ) : (
                    <p className="text-muted-foreground md:col-span-2">You don't have any upcoming rides.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Past Rides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastRides.length > 0 ? (
                    pastRides.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))
                  ) : (
                    <p className="text-muted-foreground md:col-span-2">You don't have any past rides.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
