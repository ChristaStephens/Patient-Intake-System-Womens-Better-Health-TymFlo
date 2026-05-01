import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene5() {
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
      className="absolute inset-0 flex flex-row-reverse items-center justify-between px-[8vw] bg-[#6b1e3d]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-[38%] space-y-5 z-10 pl-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-[#E8956D] font-bold tracking-widest uppercase text-[1vw] mb-3">Section 4 continued</div>
          <h2 className="text-[3vw] font-display font-bold text-white leading-tight">
            Menstrual &amp;<br />Social History
          </h2>
        </motion.div>

        <motion.p
          className="text-[1.5vw] font-body text-white/80 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Share your menstrual cycle details, pregnancy history, and a few lifestyle questions to help your provider give you the best care.
        </motion.p>

        <motion.div
          className="flex flex-col gap-2 pt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {['Menstrual cycle details', 'Number of pregnancies', 'Tobacco &amp; alcohol use', 'Exercise &amp; caffeine habits'].map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 10 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="w-2 h-2 rounded-full bg-[#E8956D] shrink-0" />
              <span className="text-[1.1vw] text-white/70" dangerouslySetInnerHTML={{ __html: label }} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Split mockup: Menstrual + Social */}
      <motion.div
        className="w-[55%] flex flex-col gap-[0.8vw]"
        initial={{ opacity: 0, y: 40 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Menstrual History */}
        <div className="bg-white/95 rounded-2xl shadow-xl p-[1.2vw]">
          <div className="border-b border-slate-100 pb-[0.7vw] mb-[0.8vw]">
            <span className="text-[0.85vw] font-bold text-[#6b1e3d]">Menstrual History</span>
          </div>
          <div className="flex flex-col gap-[0.6vw]">
            {[
              { label: 'First day of your last period', val: 'mm/dd/yyyy', type: 'date' },
              { label: 'How often does your period occur?', val: 'e.g. Every 28 days' },
              { label: 'How long does your period last?', val: 'e.g. 5 days' },
              { label: 'Number of Pregnancies', val: 'e.g. 2' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                className="flex flex-col gap-[0.2vw]"
                initial={{ opacity: 0, x: -12 }}
                animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{ delay: 0.05 + i * 0.1, duration: 0.35 }}
              >
                <span className="text-[0.7vw] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</span>
                <div className="h-[1.5vw] bg-slate-50 border border-slate-200 rounded-lg flex items-center px-[0.5vw]">
                  <span className="text-[0.72vw] text-slate-300">{f.val}</span>
                </div>
              </motion.div>
            ))}
            {/* Are your periods heavy? Yes/No */}
            <motion.div
              className="flex flex-col gap-[0.2vw]"
              initial={{ opacity: 0, x: -12 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
              transition={{ delay: 0.45, duration: 0.35 }}
            >
              <span className="text-[0.7vw] font-semibold text-slate-400 uppercase tracking-wide">Are your periods heavy?</span>
              <div className="flex gap-[0.5vw]">
                {['Yes', 'No'].map((opt, j) => (
                  <div key={opt} className={`px-[0.8vw] py-[0.3vw] rounded-lg text-[0.72vw] border font-medium
                    ${j === 0 ? 'bg-[#6b1e3d] text-white border-[#6b1e3d]' : 'bg-white text-slate-400 border-slate-200'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Social History */}
        <div className="bg-white/95 rounded-2xl shadow-xl p-[1.2vw]">
          <div className="border-b border-slate-100 pb-[0.7vw] mb-[0.8vw]">
            <span className="text-[0.85vw] font-bold text-[#6b1e3d]">Social History</span>
          </div>
          <div className="grid grid-cols-2 gap-[0.6vw]">
            {[
              { label: 'Tobacco Use', val: 'Never / Former / Current' },
              { label: 'Alcohol Use', val: 'None / Occasional / Moderate' },
              { label: 'Caffeine per day', val: 'e.g. 2 cups of coffee' },
              { label: 'Exercise frequency', val: 'e.g. 3x per week' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                className="flex flex-col gap-[0.2vw]"
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.05 + i * 0.1, duration: 0.35 }}
              >
                <span className="text-[0.68vw] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</span>
                <div className="h-[1.5vw] bg-slate-50 border border-slate-200 rounded-lg flex items-center px-[0.5vw]">
                  <span className="text-[0.68vw] text-slate-300">{f.val}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
