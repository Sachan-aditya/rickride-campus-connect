
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Home, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types';

export default function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const userString = localStorage.getItem('user');
  const user: UserType | null = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  if (!user) return null;

  // BASE NAV ITEMS
  const baseNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="w-5 h-5 mr-2" />
    },
    // NOTE: "About Us" REMOVED FOR STUDENTS - ONLY FOR NON-STUDENTS!
    // Students no longer see About Us
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="w-5 h-5 mr-2" />
    }
  ];
  const studentItems = [
    {
      name: 'My Rides',
      path: '/rides',
      icon: <MapPin className="w-5 h-5 mr-2" />
    },
    {
      name: 'Events',
      path: '/events',
      icon: <Calendar className="w-5 h-5 mr-2" />
    }
  ];

  // Only allow Events for students, not for drivers
  let navItems = [];
  if (user.role === 'student') {
    navItems = [...baseNavItems, ...studentItems];
  } else if (user.role === 'driver') {
    navItems = [...baseNavItems];
  } else {
    // Admins can have About Us and everything
    navItems = [
      ...baseNavItems,
      {
        name: 'About Us',
        path: '/about',
        icon: <User className="w-5 h-5 mr-2" />
      },
      ...studentItems
    ];
  }

  return (
    <>
      {/* Header always at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow bg-card border-b flex items-center justify-between h-16 md:px-8 px-4">
        {/* RickRide Title at the top */}
        <div className="flex items-center gap-6">
          <span className="text-2xl font-extrabold text-[#4F8EF7] tracking-widest">RickRide</span>
        </div>
        <div className="flex items-center justify-end gap-3 flex-1">
          {/* Profile button at the extreme left */}
          <NavLink to="/profile" className="flex items-center gap-2 group text-muted-foreground hover:text-[#4F8EF7] mr-auto">
            <User className="h-6 w-6" />
            <span className="hidden md:inline-block font-semibold">Profile</span>
          </NavLink>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full flex items-center gap-2 hover:bg-muted"
              >
                <span className="hidden sm:inline-block">{user.name}</span>
                <div className="h-8 w-8 rounded-full bg-[#4F8EF7]/30 flex items-center justify-center">
                  {user.profilePicture ?
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    /> :
                    <User className="h-5 w-5" />
                  }
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">User Menu</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/profile');
                    }}
                  >
                    <User className="mr-2 h-5 w-5" />
                    My Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    {/* Lucide-react only allows the allowed icons */}
                    <User className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Mobile Nav (still needed for students, no About Us) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-40 pt-1">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center px-2 py-1 w-full text-xs transition-colors",
                isActive
                  ? "text-[#4F8EF7]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full",
                    isActive ? "bg-[#4F8EF7]/20" : "bg-transparent"
                  )}>
                    {item.icon}
                  </div>
                  <span className="mt-0.5">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
