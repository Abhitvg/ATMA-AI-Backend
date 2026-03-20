import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants, fadeInUp, NEON_GREEN } from '../constants';
import { TECH_ITEMS } from '../data';
import ScrambleText from '../components/ScrambleText';

const TechCard: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; delay: number }> = ({ title, subtitle, icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay }
    }}
    whileHover={{ 
      scale: 1.02, 
      transition: { duration: 0.2, delay: 0 }
    }}
    viewport={{ once: true, margin: "-50px" }}
    className="group relative border border-white/10 bg-[#0A0A0A] p-8 hover:border-[#CCFF00]/40 transition-colors duration-500 flex flex-col justify-between min-h-[300px]"
  >
    <div>
      <div className="mb-6 text-white/50 group-hover:text-[#CCFF00] transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-mono font-bold text-white mb-4 tracking-tight">
        <ScrambleText text={title} />
      </h3>
    </div>
    
    <div className="relative">
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4" />
      <p className="font-mono text-sm text-white/60 leading-relaxed pt-4">
        {subtitle}
      </p>
    </div>

    {/* Corner Decorations */}
    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-2 h-2 border-t border-r border-[#CCFF00]" />
    </div>
    <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-2 h-2 border-b border-l border-[#CCFF00]" />
    </div>
  </motion.div>
);

const Technology: React.FC = () => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen pt-32 px-6 pb-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold font-mono pl-4 border-l-2 border-[#CCFF00]"
          >
            TECHNICAL ARCHITECTURE
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TECH_ITEMS.map((item, index) => (
            <TechCard 
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-6 border border-white/5 bg-white/[0.02] font-mono text-xs text-white/40"
        >
          &gt; REFERENCES: KUMAR, A. (2025). "Thesis: Neuro-Symbolic Agents in Unstructured Environments." IIT DELHI.
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Technology;