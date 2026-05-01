import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-light)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center justify-center relative z-10 space-y-8">
        <motion.img 
          src={`${import.meta.env.BASE_URL}images/tymflo-logo-horizontal.png`}
          alt="TymFlo"
          className="h-16"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-[4vw] font-display font-bold text-[var(--color-primary)] leading-tight mb-2 tracking-tight">
            Patient Intake Form
          </h1>
          <h2 className="text-[2.5vw] font-display text-[var(--color-secondary)]">
            Better Women's Care
          </h2>
        </motion.div>

        <motion.p
          className="text-[1.5vw] font-body text-[var(--color-secondary)] italic"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          Let's walk through it together
        </motion.p>
      </div>
    </motion.div>
  );
}
