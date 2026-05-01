import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-light)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col items-center justify-center relative z-10 space-y-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
            <img 
              src={`${import.meta.env.BASE_URL}images/tymflo-logo-full.png`}
              alt="TymFlo Logo"
              className="h-32"
            />
        </motion.div>

        <div className="text-center space-y-4">
            <motion.h2 
              className="text-[3vw] font-display font-bold text-[var(--color-primary)] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Secure. Private. Simple.
            </motion.h2>
            
            <motion.p 
              className="text-[1.8vw] font-body text-[var(--color-secondary)]"
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1 }}
            >
              Your information stays with you.
            </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
