
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RideCard from "@/components/rides/ride-card";
import { Ride } from "@/types";
import { Button } from "@/components/ui/button";
import { Navigation, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DriverDashboard() {
  const [requestedRides, setRequestedRides] = useState<Ride[]>([]);
  const [currentAcceptedRideId, setCurrentAcceptedRideId] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRides();
  }, []);

  function fetchRides() {
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    // Driver can only accept new rides if they have none ongoing/accepted
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const myAccepted = rides.find((ride: Ride) => ride.driverId === user.id && ["accepted", "ongoing"].includes(ride.status));
    setCurrentAcceptedRideId(myAccepted ? myAccepted.id : null);
    const pendingRides = rides.filter((ride: Ride) => ride.status === 'pending');
    setRequestedRides(pendingRides);
  }

  const handleAcceptRide = (ride: Ride) => {
    setIsAccepting(true);
    setTimeout(() => {
      // Update localStorage, assign the ride to the driver
      const rides = JSON.parse(localStorage.getItem('rides') || '[]');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedRides = rides.map((r: Ride) =>
        r.id === ride.id
          ? {
              ...r,
              status: "accepted",
              driverId: user.id,
              driverName: user.name,
              driverPhone: user.phone,
              vehicleNumber: user.profilePicture, // assuming vehicleNumber is stored as Rickshaw photo url or add separate if needed
            }
          : r
      );
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      
      toast({
        title: "Ride Accepted",
        description: `You have accepted the ride from ${ride.from} to ${ride.to}`,
      });
      
      fetchRides();
      setIsAccepting(false);
    }, 1000);
  };

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold">Requested Rides</h2>
      {requestedRides.length > 0 ? (
        <div className="grid gap-4">
          {requestedRides.map((ride) => (
            <Card key={ride.id} className="overflow-hidden border shadow">
              <CardContent className="p-4">
                <RideCard ride={ride} />
                <div className="pt-3">
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700"
                    disabled={!!currentAcceptedRideId || isAccepting}
                    onClick={() => handleAcceptRide(ride)}
                  >
                    {currentAcceptedRideId
                      ? "You have an active ride"
                      : isAccepting
                      ? "Accepting..."
                      : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Accept Ride
                          </>
                        )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-background/50 border">
          <CardContent className="p-6 text-center">
            <Navigation className="h-12 w-12 text-[#4F8EF7]/40 mb-3 mx-auto" />
            <p className="text-muted-foreground">No ride requests at the moment</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Check back later for new requests</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
