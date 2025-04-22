import { Clock, MapPin, User, Users, Truck, FileText } from "lucide-react";
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
  const isOngoing = ride.status === 'ongoing' || ride.status === 'accepted';
  const isPending = ride.status === 'pending';
  const isFull = availableSeats === 0;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isUserInRide = ride.riders.includes(user.id);
  
  // Mock rider data
  const mockRiders = [
    { id: "r1", name: "Aditya", photo: null },
    { id: "r2", name: "Rahul", photo: null },
    { id: "r3", name: "Priya", photo: null },
    { id: "r4", name: "Divya", photo: null },
    { id: "r5", name: "Manish", photo: null },
    { id: "r6", name: "Rohan", photo: null },
  ].slice(0, ride.riders.length);
  
  const isUserInRide = ride.riders.includes(user.id);
  const availableSeats = ride.maxCapacity - ride.riders.length;
  const isOngoing = ride.status === 'ongoing' || ride.status === 'accepted';
  const isPending = ride.status === 'pending';
  const isFull = availableSeats === 0;
  const canCancel = !isOngoing && isPending;

  return (
    <Card className="overflow-hidden animate-slide-in dark:glass-card bg-white dark:bg-transparent">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <div className="flex items-center text-rickride-blue">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <h3 className="font-medium truncate dark:text-white text-black">{ride.from}</h3>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <h3 className="font-medium truncate dark:text-white text-black">{ride.to}</h3>
            </div>
          </div>
          
          <div className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            isPending ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" : 
            isOngoing ? "bg-green-500/20 text-green-700 dark:text-green-400" : 
            "bg-gray-500/20 text-gray-700 dark:text-gray-400"
          )}>
            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
          </div>
        </div>
        
        {(ride.driverName && (isOngoing || isFull)) && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-white/10 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-rickride-blue/30">
                  <AvatarFallback className="dark:text-white text-black">{ride.driverName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="dark:text-white text-black text-sm font-medium">{ride.driverName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{ride.driverPhone}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="dark:text-white text-black text-sm font-medium">{ride.vehicleNumber}</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs">Yellow Rickshaw</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">
              {ride.riders.length}/{ride.maxCapacity} passengers
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
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
        {isPending && onJoin && !isUserInRide && !userHasActiveRide() && (
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
        
        {isPending && onCancel && isUserInRide && canCancel && (
          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-white/20 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            onClick={() => onCancel(ride)}
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

function userHasActiveRide(): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const rides = JSON.parse(localStorage.getItem('rides') || '[]');
  return rides.some((r: any) => 
    r.riders.includes(user.id) && 
    ["pending", "ongoing", "accepted"].includes(r.status)
  );
}
