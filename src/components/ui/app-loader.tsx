
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import RickRideLogo from "./rickride-logo";

export default function AppLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading your campus companion...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 2000);
    
    // Animate the loading text
    const texts = [
      "Loading your campus companion...",
      "Getting your rides ready...",
      "Connecting to RickRide...",
      "Almost there..."
    ];
    
    let index = 0;
    const textTimer = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      clearInterval(textTimer);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center mb-4">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <RickRideLogo size={60} />
          </motion.div>
        </div>
        
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2 }}
            className="h-full bg-primary"
          />
        </div>
        
        <LoadingSpinner size={28} />
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-muted-foreground"
          key={loadingText} // Force animation refresh when text changes
        >
          {loadingText}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
