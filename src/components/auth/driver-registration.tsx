
import { useState } from "react";
import { FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function DriverRegistration() {
  const [dlPhoto, setDlPhoto] = useState<File | null>(null);
  const [rickshawPhoto, setRickshawPhoto] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDlPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDlPhoto(e.target.files[0]);
    }
  };

  const handleRickshawPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRickshawPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlPhoto) {
      toast({
        title: "Driver's License Required",
        description: "Please upload a photo of your driver's license",
        variant: "destructive",
      });
      return;
    }
    if (!rickshawPhoto) {
      toast({
        title: "Rickshaw Photo Required",
        description: "Please upload a photo of your rickshaw",
        variant: "destructive",
      });
      return;
    }
    // Handle form submission
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Full Name
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Enter your full name"
              required
              className="text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Phone Number
            </label>
            <Input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              required
              className="text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email address"
              required
              className="text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Driver's License Photo
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleDlPhotoChange}
                className="text-sm text-gray-900 dark:text-gray-100"
              />
              <FileText className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Rickshaw Photo
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleRickshawPhotoChange}
                className="text-sm text-gray-900 dark:text-gray-100"
              />
              <Camera className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-rickride-blue hover:bg-rickride-blue/90">
            Register as Driver
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
