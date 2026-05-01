import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3() {
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
      className="absolute inset-0 flex flex-row-reverse items-center justify-between px-[8vw] bg-[var(--color-bg-light)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-[45%] space-y-5 z-10 pl-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-[var(--color-accent)] font-bold tracking-widest uppercase text-[1vw] mb-2">Sections 2 &amp; 3</div>
          <h2 className="text-[3.2vw] font-display font-bold text-[var(--color-primary)] leading-tight">
            Address &amp;<br />Provider Visit
          </h2>
        </motion.div>

        <motion.p
          className="text-[1.6vw] font-body text-[var(--color-secondary)] leading-relaxed"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Enter your home address, preferred pharmacy, reason for your visit, current medications, and any drug allergies.
        </motion.p>

        <motion.div
          className="flex flex-col gap-3 pt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {['Home address', 'Preferred pharmacy', 'Reason for visit', 'Current medications', 'Drug allergies'].map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 10 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
              <span className="text-[1.1vw] text-[var(--color-secondary)]">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Animated form mockup */}
      <motion.div
        className="w-[46%] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-[1.8vw] flex flex-col gap-[1.1vw]"
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Section 2 header */}
        <div className="flex items-center gap-[0.6vw] border-b border-slate-100 pb-[0.8vw]">
          <div className="w-[2vw] h-[2vw] rounded-full bg-[#9b3060]/10 flex items-center justify-center text-[0.9vw]">📍</div>
          <span className="font-bold text-[1vw] text-[#3d0e22]">Address</span>
        </div>
        {[
          { label: 'Street Address', placeholder: 'e.g. 123 Main Street', wide: true },
          { label: 'City', placeholder: 'e.g. Farmington Hills', wide: false },
          { label: 'ZIP Code', placeholder: 'e.g. 48334', wide: false },
        ].map((f, i) => (
          <motion.div
            key={f.label}
            className={f.wide ? 'flex flex-col gap-[0.25vw]' : 'flex flex-col gap-[0.25vw]'}
            initial={{ opacity: 0, x: -15 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
            transition={{ delay: 0.05 + i * 0.1, duration: 0.35 }}
          >
            <span className="text-[0.75vw] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</span>
            <div className="h-[1.6vw] bg-slate-50 border border-slate-200 rounded-lg flex items-center px-[0.6vw]">
              <span className="text-[0.78vw] text-slate-300">{f.placeholder}</span>
            </div>
          </motion.div>
        ))}

        {/* Section 3 header */}
        <motion.div
          className="flex items-center gap-[0.6vw] border-t border-b border-slate-100 py-[0.8vw] mt-[0.2vw]"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="w-[2vw] h-[2vw] rounded-full bg-[#9b3060]/10 flex items-center justify-center text-[0.9vw]">🩺</div>
          <span className="font-bold text-[1vw] text-[#3d0e22]">Provider &amp; Visit</span>
        </motion.div>
        {[
          { label: 'Reason for Visit *', placeholder: 'e.g. Annual checkup, follow-up visit' },
          { label: 'Current Medications', placeholder: 'e.g. Lisinopril 10mg, Aspirin 81mg' },
          { label: 'Drug Allergies', placeholder: 'e.g. Penicillin, Sulfa drugs' },
        ].map((f, i) => (
          <motion.div
            key={f.label}
            className="flex flex-col gap-[0.25vw]"
            initial={{ opacity: 0, x: -15 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.35 }}
          >
            <span className="text-[0.75vw] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</span>
            <div className="h-[1.6vw] bg-slate-50 border border-slate-200 rounded-lg flex items-center px-[0.6vw]">
              <span className="text-[0.78vw] text-slate-300">{f.placeholder}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
