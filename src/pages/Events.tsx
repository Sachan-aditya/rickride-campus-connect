
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import EventCard from "@/components/events/event-card";
import CreateEventForm from "@/components/events/create-event-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event, User } from "@/types";

// Mock events data
const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Annual Tech Fest",
    description: "Join us for the biggest tech event of the year with exciting workshops, competitions, and prizes!",
    poster: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    createdBy: "Tech Club",
    visibility: "public",
  },
  {
    id: "e2",
    title: "Cultural Night",
    description: "Experience an evening of dance, music, and performances from talented students across campus.",
    poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdBy: "Cultural Committee",
    visibility: "public",
  },
  {
    id: "e3",
    title: "Sports Tournament",
    description: "Inter-hostel sports tournament with cricket, football, basketball, and more. Register your team now!",
    poster: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: new Date(), // Today
    createdBy: "Sports Committee",
    visibility: "public",
  },
  {
    id: "e4",
    title: "Coding Competition",
    description: "Test your programming skills in this 24-hour hackathon with amazing prizes for winners.",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    createdBy: "Coding Club",
    visibility: "public",
  },
];

export default function Events() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userString));
    
    // Load mock events
    setEvents(mockEvents);
  }, [navigate]);
  
  const handleCreateEvent = (newEvent: Event) => {
    setEvents([newEvent, ...events]);
  };
  
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
  };
  
  const filterEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeTab) {
      case "today":
        return events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
      case "upcoming":
        return events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() > today.getTime();
        });
      case "my":
        return events.filter(event => event.createdBy === user?.name);
      default:
        return events;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] pb-20 md:pb-6">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Campus Events
            </h1>
            <p className="text-gray-400 mt-1">
              Discover and join events happening around campus
            </p>
          </div>
          
          <Button 
            className="bg-rickride-blue hover:bg-rickride-blue/90 mt-4 sm:mt-0"
            onClick={() => setIsCreateEventOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="animate-slide-in">
          <TabsList className="mb-6 bg-rickride-darkGray/50">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="my">My Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterEvents().map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  viewDetails={handleViewEvent}
                />
              ))}
              {filterEvents().length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
                  <p className="text-gray-400">
                    {activeTab === "my" 
                      ? "You haven't created any events yet." 
                      : "There are no events in this category."}
                  </p>
                  
                  {activeTab === "my" && (
                    <Button 
                      className="bg-rickride-blue hover:bg-rickride-blue/90 mt-4"
                      onClick={() => setIsCreateEventOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <CreateEventForm 
        open={isCreateEventOpen}
        onOpenChange={setIsCreateEventOpen}
        onSubmit={handleCreateEvent}
      />
      
      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="glass-card sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Posted by {selectedEvent.createdBy}
              </DialogDescription>
            </DialogHeader>
            
            <div className="aspect-[16/9] rounded-md overflow-hidden">
              <img 
                src={selectedEvent.poster} 
                alt={selectedEvent.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-rickride-blue font-medium mb-1">Date & Time</h3>
                <p className="text-white">{formatDate(selectedEvent.date)}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-rickride-blue font-medium mb-1">Description</h3>
                <p className="text-gray-300">{selectedEvent.description}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Close
              </Button>
              <Button className="bg-rickride-blue hover:bg-rickride-blue/90">
                Join Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
