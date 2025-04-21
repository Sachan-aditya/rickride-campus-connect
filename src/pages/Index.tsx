import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import RickRideLogo from "@/components/ui/rickride-logo";
import { ArrowRight, MapPin, Clock, CreditCard, Languages, Star, Building } from "lucide-react";

import CarouselImages from "@/components/ui/carousel-images";

export default function Index() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains("dark")
  );
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
    
    // Theme listener for dynamic UI updates
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    
    window.addEventListener('click', handleThemeChange);
    window.addEventListener('keydown', handleThemeChange);
    
    return () => {
      window.removeEventListener('click', handleThemeChange);
      window.removeEventListener('keydown', handleThemeChange);
    };
  }, [navigate]);
  
  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 
      ${isDarkMode 
        ? "bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-[#f1f5f9]" 
        : "bg-gradient-to-br from-[#ffffff] to-[#f1f5f9] text-[#0f172a]"}`}>

      {/* Navbar */}
      <nav className="sticky top-0 backdrop-blur-md z-50 border-b border-white/10 dark:border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RickRideLogo theme={isDarkMode ? "dark" : "light"} size={40} />
            <span className="font-bold text-2xl">
              <span className={isDarkMode ? "text-white" : "text-black"}>Rick</span>
              <span className="text-blue-500">Ride</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className={`${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="ghost" 
              className={`${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 relative">

        {/* Rolling Images Carousel as decorative (left bg or behind header) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-xl pointer-events-none opacity-80 z-0 blur-sm hidden md:block">
          <CarouselImages />
        </div>

        <div className="w-full md:w-1/2 space-y-6 animate-fade-in z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Your Ride, <span className="text-blue-500">Your Rhythm.</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-xl">
            Hop into comfort with a single tap. Whether you're heading to work, the market, or just exploring—RickRide blends tradition with tech to bring rickshaws to your fingertips.
          </p>
          <p className="flex items-center gap-2 text-lg font-semibold text-blue-500">
            <span>🛺 Affordable • Trusted • Instant</span>
          </p>
          <p className="text-sm opacity-70">Serving 30+ cities and growing... Let's get moving!</p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg shadow-lg transition-all hover:scale-105"
              onClick={() => navigate('/register')}
            >
              Book Your Ride <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className={`px-6 py-3 rounded-full text-lg transition-all hover:scale-105 
                ${isDarkMode ? 'border-white/20 hover:bg-white/10' : 'border-black/20 hover:bg-black/5'}`}
              onClick={() => navigate('/login')}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-center animate-slide-in z-10" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-80 h-80">
            {/* Decorative Rickshaw illustration */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RickRideLogo theme={isDarkMode ? "dark" : "light"} size={200} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-black/20' : 'bg-white/40'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose <span className="text-blue-500">RickRide</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Clock className="h-8 w-8 text-blue-500" />, title: "Instant Booking", description: "Book a rickshaw in seconds, no waiting in queues or haggling" },
              { icon: <MapPin className="h-8 w-8 text-blue-500" />, title: "Live Rick Locations", description: "Track your rickshaw in real-time and know exactly when they'll arrive" },
              { icon: <Languages className="h-8 w-8 text-blue-500" />, title: "Multi-language Support", description: "Use the app in your preferred language for maximum convenience" },
              { icon: <CreditCard className="h-8 w-8 text-blue-500" />, title: "Secure Payments", description: "Multiple payment options with industry-standard security" },
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl text-center transition-transform hover:scale-105
                  ${isDarkMode 
                    ? 'bg-white/5 border border-white/10 hover:border-white/20' 
                    : 'bg-white border border-black/5 hover:border-black/10 shadow-sm'}`}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Review Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          What Riders Say About <span className="text-blue-500">RickRide</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Aditya Kumar", role: "Student", rating: 5, comment: "RickRide made campus travel so convenient. No more waiting for buses or walking in the heat!" },
            { name: "Sneha Patel", role: "Professor", rating: 4, comment: "I use this daily to commute between buildings. The shared rides are a great way to save money." },
            { name: "Rahul Singh", role: "Campus Staff", rating: 5, comment: "The app is intuitive and the drivers are always on time. Highly recommended!" },
          ].map((testimonial, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-2xl bg-white/80 dark:bg-white/5 border
                ${isDarkMode 
                  ? 'border-white/10 hover:border-white/20' 
                  : 'border-black/5 hover:border-black/10 shadow-sm'} transition-transform hover:scale-105`}
            >
              <div className="flex items-center gap-1 mb-3 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < testimonial.rating ? "currentColor" : "none"} 
                    className="h-4 w-4" 
                  />
                ))}
              </div>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "{testimonial.comment}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Remove Cities Section */}
      {/* --- Cities We Cover section is removed entirely --- */}

      {/* Footer */}
      <footer className={`py-10 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">RickRide</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-blue-500">About Us</a></li>
                <li><a href="#" className="hover:text-blue-500">Blog</a></li>
                <li><a href="#" className="hover:text-blue-500">Careers</a></li>
                <li><a href="#" className="hover:text-blue-500">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Help</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-blue-500">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-500">Safety</a></li>
                <li><a href="#" className="hover:text-blue-500">Cancellation Policy</a></li>
                <li><a href="#" className="hover:text-blue-500">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-blue-500">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-blue-500">Accessibility</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Download</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-blue-500">iOS App</a></li>
                <li><a href="#" className="hover:text-blue-500">Android App</a></li>
                <li><a href="#" className="hover:text-blue-500">Business Portal</a></li>
                <li><a href="#" className="hover:text-blue-500">Driver App</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm 
            ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-black/10 text-gray-500'}">
            <p>© {new Date().getFullYear()} RickRide - Your campus mobility solution</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-500">Facebook</a>
              <a href="#" className="hover:text-blue-500">Twitter</a>
              <a href="#" className="hover:text-blue-500">Instagram</a>
              <a href="#" className="hover:text-blue-500">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
