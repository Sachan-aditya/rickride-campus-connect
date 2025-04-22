
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RideCard from "@/components/rides/ride-card";
import { Ride } from "@/types";

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
      <h2 className="text-xl font-semibold text-black dark:text-white">Requested Rides</h2>
      {requestedRides.length > 0 ? (
        <div className="grid gap-4">
          {requestedRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No ride requests at the moment
          </CardContent>
        </Card>
      )}
    </div>
  );
}
