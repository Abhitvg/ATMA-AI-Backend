import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { pageTransitionVariants, NEON_GREEN, fadeInUp, staggerContainer } from '../constants';
import { ROADMAP_MILESTONES } from '../data';
import ScrambleText from '../components/ScrambleText';

interface MilestoneProps {
  year: string;
  quarter: string;
  title: string;
  description: string;
  index: number;
}

const Milestone: React.FC<MilestoneProps> = ({ year, quarter, title, description, index }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effect: Content moves slightly relative to scroll
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={ref} className={`relative flex flex-col md:flex-row items-center justify-between w-full mb-32 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      
      {/* Content Block */}
      <div className={`w-full md:w-[42%] ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} text-center px-4 md:px-0`}>
        <motion.div 
          style={{ y }}
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group"
        >
          <div className="font-mono text-xs tracking-widest mb-2" style={{ color: NEON_GREEN }}>
            {quarter} // {year}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-[#CCFF00] transition-colors duration-300">
            <ScrambleText text={title} />
          </h3>
          <p className="text-white/60 font-light leading-relaxed text-sm font-mono">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Central Node */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
        <motion.div 
          initial={{ scale: 0, backgroundColor: "#050505", borderColor: "#333" }}
          whileInView={{ scale: 1, backgroundColor: NEON_GREEN, borderColor: NEON_GREEN }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-4 h-4 rounded-full border-2 z-20 shadow-[0_0_15px_rgba(204,255,0,0.5)] bg-[#050505]"
        />
      </div>

      {/* Empty Space for Balance */}
      <div className="hidden md:block w-[42%]" />
    </div>
  );
};

const Roadmap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen pt-32 px-6 pb-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="text-center mb-32">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold font-mono tracking-tighter mb-6 text-white">
            EXECUTION PROTOCOL
          </motion.h2>
          <motion.div 
            variants={fadeInUp}
            className="h-1 w-24 mx-auto"
            style={{ backgroundColor: NEON_GREEN }}
          />
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          
          {/* Static Background Line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />

          {/* Dynamic Scroll Line */}
          <motion.div 
            style={{ scaleY, transformOrigin: "top" }}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] shadow-[0_0_20px_#CCFF00]"
          >
            <div className="w-full h-full bg-[#CCFF00]" />
          </motion.div>

          {/* Milestones */}
          <div className="relative z-10 pt-10">
            {ROADMAP_MILESTONES.map((m, i) => (
              <Milestone key={i} {...m} index={i} />
            ))}
          </div>

          {/* End Cap */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-8">
            <div className="font-mono text-[10px] text-white/30 tracking-widest">
              END_OF_LINE
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Roadmap;