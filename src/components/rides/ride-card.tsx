
import { Clock, MapPin, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Ride } from "@/types";
import { cn } from "@/lib/utils";

interface RideCardProps {
  ride: Ride;
  onJoin?: (ride: Ride) => void;
  onCancel?: (ride: Ride) => void;
}

export default function RideCard({ ride, onJoin, onCancel }: RideCardProps) {
  const availableSeats = ride.maxCapacity - ride.riders.length;
  const isOngoing = ride.status === 'ongoing';
  const isPending = ride.status === 'pending';
  const isFull = availableSeats === 0;
  
  return (
    <Card className="overflow-hidden animate-slide-in glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <div className="flex items-center text-rickride-blue">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <h3 className="font-medium truncate">{ride.from}</h3>
            </div>
            <div className="flex items-center text-white">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <h3 className="font-medium truncate">{ride.to}</h3>
            </div>
          </div>
          
          <div className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            isPending ? "bg-yellow-500/20 text-yellow-400" : 
            isOngoing ? "bg-green-500/20 text-green-400" : 
            "bg-gray-500/20 text-gray-400"
          )}>
            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="flex items-center text-sm text-gray-300">
            <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">
              {ride.riders.length}/{ride.maxCapacity} passengers
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">
              {isOngoing && ride.eta 
                ? `${ride.eta} mins ETA` 
                : new Date(ride.created).toLocaleTimeString([], {
                    hour: '2-digit', 
                    minute:'2-digit'
                  })
              }
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between gap-2">
        {isPending && onJoin && (
          <Button 
            className={cn(
              "w-full",
              isFull 
                ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed" 
                : "bg-rickride-blue hover:bg-rickride-blue/90"
            )}
            disabled={isFull}
            onClick={() => onJoin(ride)}
          >
            {isFull ? "Full" : "Join Ride"}
          </Button>
        )}
        
        {isPending && onCancel && (
          <Button 
            variant="outline" 
            className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={() => onCancel(ride)}
          >
            Cancel
          </Button>
        )}
        
        {isOngoing && (
          <Button 
            className="w-full bg-green-600 hover:bg-green-600/90"
          >
            Track Ride
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
