import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const medConditions = [
  'Allergies', 'Anemia', 'Anxiety Disorder', 'Arthritis',
  'Asthma', 'Cancer', 'Diabetes', 'Depression',
  'Heart Disease', 'High Blood Pressure', 'Migraines', 'Thyroid Disease',
];

const obgynConditions = [
  'Abnormal Pap Smear', 'Endometriosis', 'Fibroids',
  'HPV', 'Irregular Periods', 'Ovarian Cysts',
];

export function Scene4() {
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
      className="absolute inset-0 flex items-center justify-between px-[8vw] bg-[#3d0e22]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-[38%] space-y-5 z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-[#E8956D] font-bold tracking-widest uppercase text-[1vw] mb-3">Section 4</div>
          <h2 className="text-[3.2vw] font-display font-bold text-white leading-tight">
            Clinical<br />History
          </h2>
        </motion.div>

        <motion.p
          className="text-[1.5vw] font-body text-white/80 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Check all conditions that apply to you personally, then check OB/GYN conditions you have had or currently have.
        </motion.p>

        <motion.div
          className="flex flex-col gap-2 pt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {['Past Medical History', 'OB/GYN History', 'Past surgeries & hospitalizations'].map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
            >
              <div className="w-2 h-2 rounded-full bg-[#E8956D] shrink-0" />
              <span className="text-[1.1vw] text-white/70">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Split checklist mockup */}
      <motion.div
        className="w-[55%] flex flex-col gap-[0.8vw]"
        initial={{ opacity: 0, y: 40 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Past Medical History */}
        <div className="bg-white/95 rounded-2xl shadow-xl p-[1.2vw]">
          <div className="flex items-center gap-[0.5vw] border-b border-slate-100 pb-[0.7vw] mb-[0.8vw]">
            <span className="text-[0.85vw] font-bold text-[#3d0e22]">Past Medical History — check all that apply to you</span>
          </div>
          <div className="grid grid-cols-3 gap-x-[0.8vw] gap-y-[0.5vw]">
            {medConditions.map((cond, i) => (
              <motion.div
                key={cond}
                className="flex items-center gap-[0.4vw]"
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
              >
                <div className={`w-[1.1vw] h-[1.1vw] rounded border-2 shrink-0 flex items-center justify-center
                  ${[0, 2, 6, 9].includes(i) ? 'bg-[#3d0e22] border-[#3d0e22]' : 'border-slate-300 bg-white'}`}>
                  {[0, 2, 6, 9].includes(i) && (
                    <svg className="w-full h-full text-white p-[0.1vw]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[0.72vw] text-slate-600 leading-tight">{cond}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* OB/GYN History */}
        <div className="bg-white/95 rounded-2xl shadow-xl p-[1.2vw]">
          <div className="flex items-center gap-[0.5vw] border-b border-slate-100 pb-[0.7vw] mb-[0.8vw]">
            <span className="text-[0.85vw] font-bold text-[#3d0e22]">OB/GYN History — have you ever had any of the following?</span>
          </div>
          <div className="grid grid-cols-3 gap-x-[0.8vw] gap-y-[0.5vw]">
            {obgynConditions.map((cond, i) => (
              <motion.div
                key={cond}
                className="flex items-center gap-[0.4vw]"
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.3 }}
              >
                <div className={`w-[1.1vw] h-[1.1vw] rounded border-2 shrink-0 flex items-center justify-center
                  ${[1, 4].includes(i) ? 'bg-[#3d0e22] border-[#3d0e22]' : 'border-slate-300 bg-white'}`}>
                  {[1, 4].includes(i) && (
                    <svg className="w-full h-full text-white p-[0.1vw]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[0.72vw] text-slate-600 leading-tight">{cond}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
