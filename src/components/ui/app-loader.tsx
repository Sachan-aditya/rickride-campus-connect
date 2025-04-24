
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";

export default function AppLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 2000);
    
    return () => clearTimeout(timer);
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
          <span className="text-3xl font-bold">
            <span className="dark:text-white text-black">Rick</span>
            <span className="text-[#4F8EF7]">Ride</span>
          </span>
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
        >
          Loading your campus companion...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
