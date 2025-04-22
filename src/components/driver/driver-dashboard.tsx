
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RideCard from "@/components/rides/ride-card";
import { Ride } from "@/types";
import { Navigation } from "lucide-react";

export default function DriverDashboard() {
  const [requestedRides, setRequestedRides] = useState<Ride[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    const pendingRides = rides.filter((ride: Ride) => ride.status === 'pending');
    setRequestedRides(pendingRides);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Requested Rides</h2>
      {requestedRides.length > 0 ? (
        <div className="grid gap-4">
          {requestedRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      ) : (
        <Card className="bg-[#18203380] backdrop-blur-md border border-[#4F8EF7]/10">
          <CardContent className="p-6 text-center">
            <Navigation className="h-12 w-12 text-[#4F8EF7]/40 mb-3 mx-auto" />
            <p className="text-gray-300">No ride requests at the moment</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new requests</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
