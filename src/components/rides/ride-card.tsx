
import { Clock, MapPin, User, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Ride } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RideCardProps {
  ride: Ride;
  onJoin?: (ride: Ride) => void;
  onCancel?: (ride: Ride) => void;
  onTrack?: (ride: Ride) => void;
}

export default function RideCard({ ride, onJoin, onCancel, onTrack }: RideCardProps) {
  const availableSeats = ride.maxCapacity - ride.riders.length;
  const isOngoing = ride.status === 'ongoing';
  const isPending = ride.status === 'pending';
  const isFull = availableSeats === 0;
  
  // Mock driver data for visualization
  const rickshawInfo = isFull || isOngoing ? {
    driverName: "Rakesh Kumar",
    vehicleNumber: "DL 01 RK " + Math.floor(1000 + Math.random() * 9000),
    vehicleColor: "Yellow",
    rating: 4.7
  } : null;
  
  // Mock rider data
  const mockRiders = [
    { id: "r1", name: "Aditya", photo: null },
    { id: "r2", name: "Rahul", photo: null },
    { id: "r3", name: "Priya", photo: null },
    { id: "r4", name: "Divya", photo: null },
    { id: "r5", name: "Manish", photo: null },
    { id: "r6", name: "Rohan", photo: null },
  ].slice(0, ride.riders.length);
  
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
        
        {(isFull || isOngoing) && rickshawInfo && (
          <div className="mb-3 p-2 bg-white/10 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-rickride-blue/30">
                  <AvatarFallback>{rickshawInfo.driverName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white text-sm font-medium">{rickshawInfo.driverName}</div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-xs text-gray-300">{rickshawInfo.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-sm font-medium">{rickshawInfo.vehicleNumber}</div>
                <div className="text-gray-300 text-xs">{rickshawInfo.vehicleColor} Rickshaw</div>
              </div>
            </div>
          </div>
        )}
        
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
        
        {ride.riders.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden mt-3 mb-1">
            {mockRiders.map((rider, idx) => (
              <Avatar key={rider.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-black">
                <AvatarFallback className="text-xs bg-rickride-blue/50">{rider.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {availableSeats > 0 && (
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-xs text-white ring-2 ring-black">
                +{availableSeats}
              </div>
            )}
          </div>
        )}
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
            disabled={isFull}
          >
            Cancel
          </Button>
        )}
        
        {(isOngoing || isFull) && onTrack && (
          <Button 
            className="w-full bg-green-600 hover:bg-green-600/90"
            onClick={() => onTrack(ride)}
          >
            Track Ride
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
