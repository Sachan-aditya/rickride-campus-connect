
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
import { User, LogIn } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "driver", "admin"]),
});

type FormValues = z.infer<typeof formSchema>;

const roleOptions = [
  { value: "student", label: "Student", icon: <User className="mr-2 w-5 h-5" /> },
  { value: "driver", label: "Driver", icon: <LogIn className="mr-2 w-5 h-5" /> },
  { value: "admin", label: "Admin", icon: <User className="mr-2 w-5 h-5" /> },
];

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
    }, 1100);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-7"
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-600 dark:text-[#bbe1fd]">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  className="rounded-xl h-12 px-4 text-base bg-white/95 dark:bg-black/20 border ring-1 ring-blue-100 dark:ring-blue-500 placeholder:text-slate-400"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-600 dark:text-[#bbe1fd]">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="rounded-xl h-12 px-4 text-base bg-white/95 dark:bg-black/20 border ring-1 ring-blue-100 dark:ring-blue-500 placeholder:text-slate-400"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role as Tab/Highlight */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-600 dark:text-[#bbe1fd] mb-1">
                Sign in as
              </FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => form.setValue("role", opt.value as FormValues["role"])}
                      className={`
                        flex items-center gap-1 px-4 py-2 rounded-lg border font-medium text-base 
                        transition-all
                        ${form.watch("role") === opt.value
                          ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                          : "bg-white dark:bg-black/10 text-blue-700 dark:text-blue-100 border-blue-100 dark:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-900/30"}
                      `}
                      aria-pressed={form.watch("role") === opt.value}
                      disabled={isLoading}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Login button */}
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl py-3 mt-2 text-lg font-bold
            bg-gradient-to-r from-[#4F8EF7] to-[#1977cc] shadow-blue-200 hover:scale-105 hover:bg-blue-600 transition-all"
          disabled={isLoading}
        >
          {isLoading
            ? "Signing in..."
            : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5 -ml-1" />
                Sign in
              </span>
            )
          }
        </Button>
        {/* Register shortcut */}
        <div className="flex items-center justify-center gap-1 text-base">
          <span className="text-gray-500">Don't have an account?</span>
          <Button
            variant="link"
            className="p-0 text-[#4F8EF7] text-base hover:underline"
            onClick={() => navigate("/register")}
            disabled={isLoading}
          >
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
