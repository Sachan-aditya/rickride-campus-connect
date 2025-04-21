
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Enter your full name" }),
  email: z.string().email("Enter a valid email"),
  enrollmentNo: z.string().min(2, { message: "Enter enrollment no." }),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
  role: z.enum(["student", "driver", "admin"]),
  profilePicture: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm({ isDark }: { isDark?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      enrollmentNo: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  function handleSubmit(values: FormValues) {
    setIsLoading(true);

    // Mock image upload
    let imageUrl = previewImage;
    if (values.profilePicture?.[0]) {
      imageUrl = URL.createObjectURL(values.profilePicture[0]);
    }

    // Mock role mapping for localUser
    const localUser = {
      id: Math.random().toString(36).slice(2),
      name: values.name,
      enrollmentNo: values.enrollmentNo,
      email: values.email,
      password: values.password, // never store plain passwords in prod!
      role: values.role,
      profilePicture: imageUrl,
    };

    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify(localUser));

      toast({
        title: "Registration successful!",
        description: `Welcome to RickRide as a ${values.role.charAt(0).toUpperCase() + values.role.slice(1)}!`,
      });

      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    }, 1100);
  }

  // For glassy text-fields and role selection
  const glassInput = `glass-effect text-${isDark ? "white" : "gray-700"} 
    placeholder:text-${isDark ? "gray-400" : "gray-500"}`;

  return (
    <form
      className="space-y-7"
      onSubmit={form.handleSubmit(handleSubmit)}
      autoComplete="off"
    >
      {/* Avatar Upload Field */}
      <div className="flex justify-center mb-2">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={previewImage || ""} alt="Profile" />
            <AvatarFallback className="bg-blue-200/50 text-blue-600 text-xl">
              {form.watch("name")?.charAt(0)?.toUpperCase() || "R"}
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            disabled={isLoading}
            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            style={{ zIndex: 5 }}
            onChange={(e) => {
              handleImageChange(e);
              form.setValue("profilePicture", e.target.files);
            }}
            aria-label="Upload profile photo"
          />
        </div>
      </div>
      {/* Full Name */}
      <Input
        placeholder="Full Name"
        {...form.register("name")}
        disabled={isLoading}
        className={`${glassInput} w-full`}
      />
      {form.formState.errors.name && (
        <span className="text-red-500 text-xs">{form.formState.errors.name.message}</span>
      )}
      {/* Enrollment No. */}
      <Input
        placeholder="Enrollment No."
        {...form.register("enrollmentNo")}
        disabled={isLoading}
        className={`${glassInput} w-full`}
      />
      {form.formState.errors.enrollmentNo && (
        <span className="text-red-500 text-xs">{form.formState.errors.enrollmentNo.message}</span>
      )}
      {/* Email */}
      <Input
        placeholder="Email Address"
        type="email"
        {...form.register("email")}
        disabled={isLoading}
        className={`${glassInput} w-full`}
      />
      {form.formState.errors.email && (
        <span className="text-red-500 text-xs">{form.formState.errors.email.message}</span>
      )}
      {/* Password */}
      <Input
        placeholder="Password"
        type="password"
        {...form.register("password")}
        disabled={isLoading}
        className={`${glassInput} w-full`}
      />
      {form.formState.errors.password && (
        <span className="text-red-500 text-xs">{form.formState.errors.password.message}</span>
      )}
      {/* Role Selection */}
      <div>
        <label className="block mb-1 text-sm font-medium text-rickride-blue">
          Register as
        </label>
        <Select
          defaultValue="student"
          onValueChange={(val) => form.setValue("role", val as FormValues["role"])}
          disabled={isLoading}
        >
          <SelectTrigger className={`${glassInput} w-full min-h-10`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className={`z-[100] ${isDark
              ? "bg-[#232d3b]/90 text-white"
              : "bg-white/90 text-gray-800 border border-blue-100"
              }`}
            style={{ boxShadow: "0 4px 24px 0 rgba(79, 142, 247, 0.18)" }}>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Submit */}
      <Button
        type="submit"
        className="w-full rounded-lg py-2 bg-rickride-blue text-white shadow-lg hover:scale-105 transition-transform"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Sign Up"}
      </Button>
    </form>
  );
}
