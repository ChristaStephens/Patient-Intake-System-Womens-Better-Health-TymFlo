import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-between px-[8vw] bg-[var(--color-bg-light)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-[40%] space-y-6 z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-[var(--color-accent)] font-bold tracking-widest uppercase text-[1vw] mb-2">Section 1</div>
          <h2 className="text-[3.5vw] font-display font-bold text-[var(--color-primary)] leading-tight">
            Personal<br/>Information
          </h2>
        </motion.div>

        <motion.p 
          className="text-[1.8vw] font-body text-[var(--color-secondary)] leading-relaxed"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Fill in your full name, date of birth, address, and contact details. 
          <br/><br/>
          <span className="text-[var(--color-accent)] font-semibold">All fields marked with * are required.</span>
        </motion.p>
      </div>

      <motion.div 
        className="w-[50%] relative shadow-2xl rounded-2xl overflow-hidden border-4 border-white/40"
        initial={{ opacity: 0, y: 50, rotateY: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0, rotateY: -5 } : { opacity: 0, y: 50, rotateY: 20 }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20 }}
        style={{ perspective: "1000px" }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/screen-form-header.jpg`} 
          alt="Form Header" 
          className="w-full h-auto object-cover object-top max-h-[80vh]"
        />
        
        {/* Animated highlight box over required fields */}
        {phase >= 3 && (
          <motion.div 
            className="absolute top-[30%] left-[10%] w-[80%] h-[40%] border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 rounded-lg"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, originX: 0 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
