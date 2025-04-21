
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Home, LogOut, MapPin, Menu, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types';

export default function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // In a real app, this would come from your auth provider
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
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="w-5 h-5 mr-2" /> 
    },
    { 
      name: 'Live Rides', 
      path: '/rides', 
      icon: <MapPin className="w-5 h-5 mr-2" /> 
    },
    { 
      name: 'Events', 
      path: '/events', 
      icon: <Calendar className="w-5 h-5 mr-2" /> 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User className="w-5 h-5 mr-2" /> 
    },
  ];
  
  return (
    <>
      {/* Mobile navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-rickride-darkGray border-t border-white/10 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center px-2 py-1 w-full text-xs transition-colors",
                isActive 
                  ? "text-rickride-blue" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              {({isActive}) => (
                <>
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full",
                    isActive ? "bg-rickride-blue/20" : "bg-transparent"
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
      
      {/* Desktop navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-rickride-darkGray border-b border-white/10 px-6 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-rickride-blue mr-12">RickRide</h1>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-rickride-blue/20 text-rickride-blue" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full flex items-center gap-2 text-white hover:bg-white/10"
                >
                  <span className="hidden sm:inline-block">{user.name}</span>
                  <div className="h-8 w-8 rounded-full bg-rickride-blue/30 flex items-center justify-center">
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
              <SheetContent className="bg-rickride-darkGray border-l border-white/10">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">User Menu</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
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
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}
