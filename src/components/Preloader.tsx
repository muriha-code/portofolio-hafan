import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  isDataLoaded: boolean;
  onFinished: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ isDataLoaded, onFinished }) => {
  const [statusText, setStatusText] = useState("Initializing Portfolio...");
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    document.title = "Web Portofolio";
  }, []);

  useEffect(() => {
    const statuses = [
      "Initializing Portfolio...",
      "Loading Projects...",
      "Loading Experience...",
      "Preparing Portfolio...",
      "Welcome."
    ];
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < statuses.length - 1) {
        currentIdx++;
        setStatusText(statuses[currentIdx]);
        setProgress((currentIdx / (statuses.length - 1)) * 100);
      } else {
        clearInterval(interval);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100 && isDataLoaded) {
      const timer1 = setTimeout(() => {
        setIsFadingOut(true);
        const timer2 = setTimeout(() => {
          onFinished();
        }, 600); // Wait for the exit animation to complete
        return () => clearTimeout(timer2);
      }, 400); // Pause at "Welcome." before fading out
      return () => clearTimeout(timer1);
    }
  }, [progress, isDataLoaded, onFinished]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center text-white selection:bg-primary/20"
        >
          <div className="w-full max-w-sm px-8 flex flex-col items-center">
            {/* Identity Text */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-10 text-white"
            >
              Muriha Studio
            </motion.h1>

            {/* Progress Bar Container */}
            <div className="w-full h-[3px] bg-slate-800 rounded-full overflow-hidden mb-5 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "linear" }}
              />
            </div>

            {/* Loading Status */}
            <div className="h-6 w-full text-center relative flex justify-center">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={statusText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-[0.2em] uppercase absolute"
                >
                  {statusText}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
