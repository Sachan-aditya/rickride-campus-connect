
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
  viewDetails?: (event: Event) => void;
}

export default function EventCard({ event, viewDetails }: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="overflow-hidden animate-slide-in glass-card">
      <div className="aspect-[5/3] relative overflow-hidden">
        <img 
          src={event.poster} 
          alt={event.title} 
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {event.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <User className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">By {event.createdBy}</span>
          </div>
        </div>
      </CardContent>
      
      {viewDetails && (
        <CardFooter className="p-3 pt-0">
          <Button 
            variant="outline" 
            className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={() => viewDetails(event)}
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
