
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  bio: z.string().max(150).optional(),
  profilePicture: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  user: User;
  onSubmit?: (values: Partial<User>) => void;
}

export default function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(user.profilePicture || null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone || "",
      gender: (user.gender as any) || "",
      bio: "",
    },
  });

  function handleSubmit(values: FormValues) {
    setIsLoading(true);
    
    // Normally we'd upload the file to storage, but we'll just mock it
    let imageUrl = user.profilePicture;
    if (values.profilePicture?.[0]) {
      imageUrl = URL.createObjectURL(values.profilePicture[0]);
    }
    
    // Mock API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      const updatedUser = {
        ...user,
        ...values,
        profilePicture: imageUrl,
      };
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully",
      });
      
      onSubmit?.(updatedUser);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewImage || ""} alt={user.name} />
              <AvatarFallback className="bg-rickride-blue/30 text-white text-xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem className="absolute -bottom-3 -right-3">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={isLoading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          handleImageChange(e);
                          onChange(e.target.files);
                        }}
                        {...field}
                      />
                      <Button
                        type="button"
                        size="icon"
                        className="rounded-full bg-rickride-blue hover:bg-rickride-blue/90"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4779 10.2794 11.496 9.31166C10.7245 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-rickride-lightGray">Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="glass-effect text-white placeholder:text-gray-400"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-rickride-lightGray">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+91 9876543210"
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-rickride-lightGray">Gender</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="glass-effect text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-rickride-lightGray">Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself"
                  disabled={isLoading}
                  className="glass-effect text-white placeholder:text-gray-400 min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-rickride-blue hover:bg-rickride-blue/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
