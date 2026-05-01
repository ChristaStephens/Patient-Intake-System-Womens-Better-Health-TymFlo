import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const consents = [
  {
    title: 'Notice of Privacy Practices',
    text: 'I acknowledge receipt of this practice\'s Notice of Privacy Practices and understand how my health information may be used.',
  },
  {
    title: 'Assignment of Benefits',
    text: 'I authorize this practice to bill my insurance directly and understand I am responsible for any remaining balance.',
  },
  {
    title: 'Financial Responsibility',
    text: 'I understand and accept responsibility for all charges for services provided at this practice.',
  },
  {
    title: 'Insurance & Claims',
    text: 'I authorize claim submission on my behalf and accept full financial responsibility for any denied or outstanding balances.',
  },
];

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-row-reverse items-center justify-between px-[8vw] bg-[#3d0e22]"
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
          <div className="text-[#E8956D] font-bold tracking-widest uppercase text-[1vw] mb-3">Section 7</div>
          <h2 className="text-[3.2vw] font-display font-bold text-white leading-tight">
            Legal &amp;<br />Signature
          </h2>
        </motion.div>

        <motion.p
          className="text-[1.5vw] font-body text-white/80 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Review and check each authorization, then sign by drawing or typing your full legal name. When done, download or print your completed form to bring to your appointment.
        </motion.p>

        <motion.div
          className="flex flex-col gap-3 pt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {[
            { icon: '✓', label: 'Check all 4 consent boxes' },
            { icon: '✍', label: 'Sign (draw or type your name)' },
            { icon: '⬇', label: 'Download as PDF or export CSV' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 10 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              <div className="w-8 h-8 rounded-full bg-[#E8956D]/20 border border-[#E8956D]/50 flex items-center justify-center shrink-0">
                <span className="text-[#E8956D] text-[0.9vw]">{item.icon}</span>
              </div>
              <span className="text-[1.1vw] text-white/70">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Consent + Signature mockup */}
      <motion.div
        className="w-[55%] bg-white/95 rounded-2xl shadow-2xl overflow-hidden p-[1.4vw] flex flex-col gap-[0.8vw]"
        initial={{ opacity: 0, y: 40 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="flex items-center gap-[0.6vw] border-b border-slate-100 pb-[0.8vw]">
          <span className="font-bold text-[0.9vw] text-[#3d0e22]">Section 7 — Legal &amp; Signature</span>
        </div>

        {consents.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex items-start gap-[0.6vw] bg-slate-50 rounded-xl p-[0.7vw]"
            initial={{ opacity: 0, x: -16 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ delay: 0.08 + i * 0.12, duration: 0.4 }}
          >
            <motion.div
              className="w-[1.3vw] h-[1.3vw] rounded border-2 border-[#3d0e22] flex items-center justify-center shrink-0 mt-[0.1vw]"
              animate={phase >= 3 ? { backgroundColor: '#3d0e22' } : { backgroundColor: 'transparent' }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.25 }}
            >
              {phase >= 3 && (
                <svg className="w-full h-full text-white p-[0.12vw]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <motion.path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4 + i * 0.12, duration: 0.25 }}
                  />
                </svg>
              )}
            </motion.div>
            <div className="flex flex-col gap-[0.1vw]">
              <span className="text-[0.68vw] font-bold text-slate-500 uppercase tracking-wide">{item.title}</span>
              <span className="text-[0.7vw] text-slate-600 leading-snug">{item.text}</span>
            </div>
          </motion.div>
        ))}

        {/* Signature block */}
        <motion.div
          className="bg-slate-50 rounded-xl p-[0.8vw] border border-slate-200"
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <span className="text-[0.72vw] font-bold text-[#3d0e22] uppercase tracking-wide">Electronic Signature</span>
          <div className="flex gap-[0.5vw] mt-[0.5vw] mb-[0.5vw]">
            <div className="px-[0.8vw] py-[0.3vw] bg-[#3d0e22] text-white rounded-md text-[0.7vw] font-medium">Draw</div>
            <div className="px-[0.8vw] py-[0.3vw] bg-white border border-slate-200 text-slate-400 rounded-md text-[0.7vw] font-medium">Type</div>
          </div>
          <div className="h-[2.5vw] bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center">
            <span className="text-[0.7vw] text-slate-300 italic">Sign using your mouse or finger</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
