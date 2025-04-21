
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "driver", "admin"]),
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
      role: "student",
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify({
        id: "user123",
        name: "Aditya Kumar",
        email: values.email,
        enrollmentNo: "BT19CSE021",
        role: values.role,
      }));

      toast({
        title: "Welcome back!",
        description: `Logged in as ${values.role.charAt(0).toUpperCase() + values.role.slice(1)}`,
      });

      navigate("/dashboard");
    }, 1000);
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 animate-fade-in"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-rickride-blue text-base">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    className="glass-effect rounded-lg h-12 px-4 text-lg focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-black/30 ring-1 ring-blue-100 shadow-lg placeholder:text-gray-400"
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
                <FormLabel className="text-rickride-blue text-base">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="glass-effect rounded-lg h-12 px-4 text-lg focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-black/30 ring-1 ring-blue-100 shadow-lg placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-rickride-blue text-base">Role</FormLabel>
                <FormControl>
                  <Select
                    disabled={isLoading}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="glass-effect rounded-lg h-12 px-4 text-base bg-white/80 dark:bg-black/30 ring-1 ring-blue-100 shadow-lg focus:ring-2 focus:ring-blue-400">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white dark:bg-[#23243b] text-gray-900 dark:text-white rounded-xl shadow-lg">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full rounded-xl py-3 bg-rickride-blue text-white text-lg shadow-blue-200 hover:scale-105 hover:bg-blue-600 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="flex items-center justify-center gap-1 text-base">
              <span className="text-gray-500">Don't have an account?</span>
              <Button
                variant="link"
                className="p-0 text-rickride-blue text-base"
                onClick={() => navigate("/register")}
                disabled={isLoading}
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
