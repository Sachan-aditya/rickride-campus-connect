
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Mock authentication - In a real app this would connect to your auth service
    setTimeout(() => {
      setIsLoading(false);
      // Mock successful login for now
      localStorage.setItem("user", JSON.stringify({
        id: "user123",
        name: "Aditya Kumar",
        email: values.email,
        enrollmentNo: "BT19CSE021",
        role: "student"
      }));
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      
      navigate("/dashboard");
    }, 1000);
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-rickride-lightGray">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-rickride-lightGray">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="glass-effect text-white placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-rickride-blue hover:bg-rickride-blue/90 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="flex items-center justify-center gap-1 text-sm">
              <span className="text-white/70">Don't have an account?</span>
              <Button
                variant="link"
                className="p-0 text-rickride-blue"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
