import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants, fadeInUp, staggerContainer, NEON_GREEN } from '../constants';
import { TEAM_MEMBERS } from '../data';
import ScrambleText from '../components/ScrambleText';

const EngineerProfile: React.FC<{ name: string; role: string; specs: string; index: string }> = ({ name, role, specs, index }) => (
  <motion.div 
    variants={fadeInUp}
    className="flex flex-col md:flex-row gap-8 py-12 border-b border-white/10 group"
  >
    <div className="font-mono text-xs text-[#CCFF00] pt-2">{index}</div>
    
    <div className="flex-1">
      <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#CCFF00] transition-colors duration-300">
        <ScrambleText text={name} />
      </h3>
      <div className="inline-block px-2 py-1 bg-white/10 rounded text-xs font-mono text-white/80 mb-6">
        {role}
      </div>
      <p className="font-mono text-sm text-white/60 leading-loose max-w-2xl">
        {specs}
      </p>
    </div>
  </motion.div>
);

const Team: React.FC = () => {
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
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold font-mono mb-16 pl-4 border-l-2 border-[#CCFF00]">
            ENGINEERING CORE
          </motion.h2>

          <div className="flex flex-col">
            {TEAM_MEMBERS.map((member, i) => (
              <EngineerProfile 
                key={member.name}
                index={String(i + 1).padStart(2, '0')}
                name={member.name}
                role={member.role}
                specs={member.specs}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Team;