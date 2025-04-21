
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.date({
    required_error: "Please select a date and time",
  }),
  poster: z
    .any()
    .refine((files) => files?.[0], "Please select an image file.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp files are accepted."
    ),
  visibility: z.enum(["public", "private"], {
    required_error: "Please select visibility",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: any) => void;
}

export default function CreateEventForm({ open, onOpenChange, onSubmit }: CreateEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "public",
    },
  });

  function handleSubmit(values: FormValues) {
    setIsLoading(true);
    
    // Normally we'd upload the file to storage, but we'll just mock it for now
    const mockImageUrl = URL.createObjectURL(values.poster[0]);
    
    // Mock API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Create the event object with mock data
      const eventData = {
        ...values,
        id: `event-${Date.now()}`,
        poster: mockImageUrl,
        createdBy: "Aditya Kumar",
      };
      
      toast({
        title: "Event created!",
        description: "Your event has been posted successfully",
      });
      
      onSubmit?.(eventData);
      onOpenChange(false);
      form.reset();
      setPreviewImage(null);
    }, 1000);
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Create New Event</DialogTitle>
          <DialogDescription>
            Share your campus event with other students.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rickride-lightGray">Event Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event title"
                      disabled={isLoading}
                      className="glass-effect text-white placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rickride-lightGray">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event"
                      disabled={isLoading}
                      className="glass-effect text-white placeholder:text-gray-400 min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-rickride-lightGray">Event Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal glass-effect text-white",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP p")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-rickride-darkGray" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="poster"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-rickride-lightGray">Event Poster</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={isLoading}
                        className="glass-effect text-white"
                        onChange={(e) => {
                          handleImageChange(e);
                          onChange(e.target.files);
                        }}
                        {...field}
                      />
                      {previewImage && (
                        <div className="relative aspect-[5/3] overflow-hidden rounded-md">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rickride-lightGray">Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Public - Visible to everyone
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Private - Visible to invited users only
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                  setPreviewImage(null);
                }}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                disabled={isLoading}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-rickride-blue hover:bg-rickride-blue/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
