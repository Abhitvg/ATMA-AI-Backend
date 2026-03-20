import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants, fadeInUp, staggerContainer, NEON_GREEN } from '../constants';
import { Activity } from 'lucide-react';
import { USE_CASES } from '../data';
import ScrambleText from '../components/ScrambleText';

const CaseCard: React.FC<{ 
  title: string; 
  sector: string; 
  problem: string; 
  solution: string; 
  icon: React.ReactNode; 
  index: number 
}> = ({ title, sector, problem, solution, icon, index }) => (
  <motion.div 
    variants={fadeInUp}
    className="relative border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-sm p-8 group hover:border-[#CCFF00]/30 transition-all duration-300"
  >
    {/* Header */}
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-white/5 rounded-sm text-[#CCFF00] group-hover:bg-[#CCFF00]/10 transition-colors">
        {icon}
      </div>
      <div className="font-mono text-xs text-white/30 tracking-widest">
        SCENARIO_{String(index + 1).padStart(2, '0')}
      </div>
    </div>

    {/* Title */}
    <div className="mb-6">
      <h3 className="text-xl font-mono font-bold text-white mb-2">
        <ScrambleText text={title} />
      </h3>
      <div className="inline-block px-2 py-0.5 border border-white/10 text-[10px] font-mono tracking-wider text-[#CCFF00]">
        {sector}
      </div>
    </div>

    {/* Details */}
    <div className="space-y-4 font-mono text-sm leading-relaxed">
      <div>
        <span className="text-red-400 block text-[10px] tracking-widest mb-1">PROBLEM_STATE:</span>
        <p className="text-white/60">{problem}</p>
      </div>
      <div className="pt-4 border-t border-white/10">
        <span className="text-[#CCFF00] block text-[10px] tracking-widest mb-1">ATMA_RESOLUTION:</span>
        <p className="text-white/80">{solution}</p>
      </div>
    </div>

    {/* Corner Accent */}
    <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[10px] border-t-transparent border-r-[10px] border-r-[#CCFF00]/20 group-hover:border-r-[#CCFF00] transition-colors duration-300" />
  </motion.div>
);

const UseCases: React.FC = () => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen pt-32 px-6 pb-20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Header */}
          <div className="mb-20 border-l-2 border-[#CCFF00] pl-6">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold font-mono mb-4 text-white">
              OPERATIONAL SCENARIOS
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/60 max-w-2xl font-light">
              High-stakes environments where standard stochastic models fail. 
              Neuro-symbolic reliability is non-negotiable.
            </motion.p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {USE_CASES.map((c, index) => (
              <CaseCard 
                key={c.title}
                index={index}
                icon={c.icon}
                title={c.title}
                sector={c.sector}
                problem={c.problem}
                solution={c.solution}
              />
            ))}
          </div>

          {/* Bottom Callout */}
          <motion.div variants={fadeInUp} className="mt-16 flex items-center justify-between border border-[#CCFF00]/20 bg-[#CCFF00]/5 p-6 rounded-sm">
             <div className="flex items-center gap-4">
                <Activity className="text-[#CCFF00]" size={24} />
                <div className="font-mono text-sm text-white">
                  <span className="block text-xs text-white/50 tracking-widest">DEPLOYMENT READINESS</span>
                  TRL-7 (SYSTEM PROTOTYPE DEMONSTRATION)
                </div>
             </div>
             <div className="hidden md:block font-mono text-xs text-[#CCFF00] animate-pulse">
               AWAITING_INSTRUCTIONS...
             </div>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default UseCases;