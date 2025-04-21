
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import RideCard from "@/components/rides/ride-card";
import EventCard from "@/components/events/event-card";
import ProfileForm from "@/components/profile/profile-form";
import { User, Ride, Event } from "@/types";

// Mock past rides
const mockPastRides: Ride[] = [
  {
    id: "r1",
    from: "Hostel A",
    to: "Library",
    status: "completed",
    riders: ["user1", "user2"],
    maxCapacity: 6,
    created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r2",
    from: "Main Gate",
    to: "Academic Block",
    status: "completed",
    riders: ["user1", "user3"],
    maxCapacity: 6,
    created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Mock upcoming rides
const mockUpcomingRides: Ride[] = [
  {
    id: "r3",
    from: "Sports Complex",
    to: "Hostel B",
    status: "pending",
    riders: ["user1"],
    maxCapacity: 6,
    created: new Date(),
  },
];

// Mock user events
const mockUserEvents: Event[] = [
  {
    id: "e1",
    title: "Coding Workshop",
    description: "Learn the basics of web development with HTML, CSS, and JavaScript.",
    poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdBy: "Aditya Kumar",
    visibility: "public",
  },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<User | null>(null);
  const [pastRides, setPastRides] = useState<Ride[]>([]);
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userString));
    
    // Load mock data
    setPastRides(mockPastRides);
    setUpcomingRides(mockUpcomingRides);
    setEvents(mockUserEvents);
  }, [navigate]);
  
  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] pb-20 md:pb-6">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            My Profile
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your profile and view your activity
          </p>
        </div>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="animate-slide-in">
          <TabsList className="mb-6 bg-rickride-darkGray/50">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="rides">My Rides</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <Card className="glass-card">
              <CardContent className="p-6">
                <ProfileForm user={user} onSubmit={handleUpdateProfile} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rides" className="mt-0">
            <Card className="glass-card mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Upcoming Rides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingRides.length > 0 ? (
                    upcomingRides.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))
                  ) : (
                    <p className="text-gray-400 md:col-span-2">You don't have any upcoming rides.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Past Rides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastRides.length > 0 ? (
                    pastRides.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))
                  ) : (
                    <p className="text-gray-400 md:col-span-2">You don't have any past rides.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <Card className="glass-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">My Events</h2>
                
                {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No events created</h3>
                    <p className="text-gray-400">
                      You haven't created any events yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
