
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Users, Link as LinkIcon, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import EventCard from "@/components/events/event-card";
import CreateEventForm from "@/components/events/create-event-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Event, User } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock events data with registration links
const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Annual Tech Fest",
    description: "Join us for the biggest tech event of the year with exciting workshops, competitions, and prizes!",
    poster: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    createdBy: "Tech Club",
    visibility: "public",
    attendees: 85,
    location: "Main Auditorium",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSf9_example_form_link/viewform"
  },
  {
    id: "e2",
    title: "Cultural Night",
    description: "Experience an evening of dance, music, and performances from talented students across campus.",
    poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdBy: "Cultural Committee",
    visibility: "public",
    attendees: 120,
    location: "Open Air Theatre",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLScZ_example_form_link/viewform"
  },
  {
    id: "e3",
    title: "Sports Tournament",
    description: "Inter-hostel sports tournament with cricket, football, basketball, and more. Register your team now!",
    poster: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: new Date(), // Today
    createdBy: "Sports Committee",
    visibility: "public",
    attendees: 200,
    location: "Sports Complex",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSdT_example_form_link/viewform"
  },
  {
    id: "e4",
    title: "Coding Competition",
    description: "Test your programming skills in this 24-hour hackathon with amazing prizes for winners.",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    createdBy: "Coding Club",
    visibility: "public",
    attendees: 75,
    location: "Computer Center",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSeY_example_form_link/viewform"
  },
];

export default function Events() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState<User | null>(null);
  const [registrationLink, setRegistrationLink] = useState<string>("");
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
    
    // Load mock events
    setEvents(mockEvents);
  }, [navigate]);
  
  const handleCreateEvent = (newEvent: Event) => {
    setEvents([newEvent, ...events]);
  };
  
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    if (event.registrationLink) {
      setRegistrationLink(event.registrationLink);
    }
  };
  
  const handleRegister = () => {
    if (selectedEvent?.registrationLink) {
      // In a real app, we would first track this registration in our database
      window.open(selectedEvent.registrationLink, '_blank');
      
      toast({
        title: "Registration initiated",
        description: "You're being redirected to the registration form",
      });
    }
  };
  
  const copyRegistrationLink = () => {
    if (selectedEvent?.registrationLink) {
      navigator.clipboard.writeText(selectedEvent.registrationLink);
      
      toast({
        title: "Link copied!",
        description: "Registration link copied to clipboard",
      });
    }
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
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white/5 text-rickride-blue border-rickride-blue/20">
                  <Calendar className="h-3 w-3 mr-1" /> 
                  {formatDate(selectedEvent.date)}
                </Badge>
                
                {selectedEvent.location && (
                  <Badge variant="outline" className="bg-white/5 text-white border-white/20">
                    <MapPin className="h-3 w-3 mr-1" /> 
                    {selectedEvent.location}
                  </Badge>
                )}
                
                {selectedEvent.attendees && (
                  <Badge variant="outline" className="bg-white/5 text-white border-white/20">
                    <Users className="h-3 w-3 mr-1" /> 
                    {selectedEvent.attendees}+ attending
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-sm text-rickride-blue font-medium mb-1">Description</h3>
                <p className="text-gray-300">{selectedEvent.description}</p>
              </div>
              
              {selectedEvent.registrationLink && (
                <div>
                  <h3 className="text-sm text-rickride-blue font-medium mb-1">Registration</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 relative">
                      <Input 
                        value={registrationLink}
                        readOnly
                        className="pr-10 bg-white/5 text-gray-300 text-sm border-white/20"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={copyRegistrationLink}
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Register using the Google Form link above</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="sm:justify-between flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>
              
              <div className="flex gap-2">
                {selectedEvent.registrationLink && (
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white flex items-center gap-1"
                    onClick={() => window.open(selectedEvent.registrationLink, '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Form
                  </Button>
                )}
                <Button 
                  size="sm"
                  className="bg-rickride-blue hover:bg-rickride-blue/90"
                  onClick={handleRegister}
                >
                  Register Now
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
