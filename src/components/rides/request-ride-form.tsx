
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const campusLocations = [
  { value: "guna", label: "Guna" },
  { value: "metro", label: "Metro" },
  { value: "sada-chauharha", label: "Sada Chauharha" },
  { value: "main-gate", label: "Main Gate" },
  { value: "awan", label: "Awan" },
  { value: "ruthiyai-station", label: "Ruthiyai Station" },
  { value: "guna-station", label: "Guna Station" }
];

const formSchema = z.object({
  from: z.string({
    required_error: "Please select a starting point",
  }),
  to: z.string({
    required_error: "Please select a destination",
  }),
}).refine(data => data.from !== data.to, {
  message: "Destination must be different from starting point",
  path: ["to"],
});

type FormValues = z.infer<typeof formSchema>;

interface RequestRideFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: FormValues) => void;
}

export default function RequestRideForm({ open, onOpenChange, onSubmit }: RequestRideFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    
    // Check if user is already in a ride
    const existingRides = JSON.parse(localStorage.getItem('rides') || '[]');
    const userHasRide = existingRides.some((ride: any) => 
      ride.riders.includes(user.id) && 
      ["pending", "ongoing", "accepted"].includes(ride.status)
    );
    
    if (userHasRide) {
      setIsLoading(false);
      toast({
        title: "Cannot request ride",
        description: "You can only have one active ride at a time. Please complete your current ride first.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock API call delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Ride requested!",
        description: `From ${getLabelFromValue(values.from)} to ${getLabelFromValue(values.to)}`,
      });
      
      onSubmit?.(values);
      onOpenChange(false);
      form.reset();
    }, 1000);
  }
  
  function getLabelFromValue(value: string): string {
    return campusLocations.find(location => location.value === value)?.label || value;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:glass-card dark:bg-transparent">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black dark:text-white">Request a Ride</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Select your pick-up location and destination to request a rickshaw ride.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Pick-up Location</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-black dark:text-white bg-gray-50 dark:bg-transparent dark:glass-effect">
                        <SelectValue placeholder="Select starting point" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campusLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Destination</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-black dark:text-white bg-gray-50 dark:bg-transparent dark:glass-effect">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campusLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-black dark:text-white border-gray-200 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-rickride-blue hover:bg-rickride-blue/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Requesting..." : "Request Ride"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
