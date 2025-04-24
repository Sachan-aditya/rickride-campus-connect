
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Home, LogOut, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export default function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) return null;

  const userRole = profile?.role || 'student';
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  const baseNavItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="w-5 h-5 mr-2" /> 
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
  
  const navItems = userRole === 'driver' ? baseNavItems : [...baseNavItems, ...studentItems];
  
  return (
    <>
      {/* Mobile navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center px-2 py-1 w-full text-xs transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {({isActive}) => (
                <>
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full",
                    isActive ? "bg-primary/20" : "bg-transparent"
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
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-card border-b z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold mr-12">
              <span className="dark:text-white text-black">Rick</span>
              <span className="text-[#4F8EF7]">Ride</span>
            </span>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Footer with attribution */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-40 md:bottom-8 pointer-events-none">
        <p className="text-xs text-muted-foreground/70">
          Made with love by ADITYA SACHAN ❤️
        </p>
      </div>
    </>
  );
}
