import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '../constants';
import ScrambleText from '../components/ScrambleText';

const IndustryCard: React.FC<{ title: string; imgId: number; align: 'left' | 'right' }> = ({ title, imgId, align }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.8 }}
    className={`flex w-full mb-32 ${align === 'right' ? 'justify-end' : 'justify-start'}`}
  >
    <div className="relative group w-full md:w-2/3 lg:w-1/2 aspect-video overflow-hidden border border-white/10 cursor-none">
      <img 
        src={`https://picsum.photos/id/${imgId}/800/500`} 
        alt={title}
        className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      
      <div className="absolute bottom-0 left-0 p-8 z-10">
        <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mix-blend-overlay group-hover:mix-blend-normal transition-all pointer-events-auto cursor-crosshair">
          <ScrambleText text={title} />
        </h3>
        <div className="h-[2px] w-0 bg-[#39FF14] mt-2 group-hover:w-full transition-all duration-500 ease-in-out" />
      </div>

      {/* Distortion overlay hint */}
      <div className="absolute inset-0 bg-[#39FF14] mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </div>
  </motion.div>
);

const Industries: React.FC = () => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen pt-32 px-6 md:px-20 overflow-y-auto"
    >
      <div className="mb-20">
        <h1 className="text-sm font-mono tracking-widest text-[#39FF14] mb-4">DEPLOYMENT SECTORS</h1>
        <p className="text-2xl md:text-3xl max-w-2xl font-light text-white/80">
          Heavy industry automation requiring high-reliability in unstructured environments.
        </p>
      </div>

      <div className="pb-32">
        <IndustryCard title="AERIAL DRONES" imgId={119} align="left" />
        <IndustryCard title="ROBOTICS" imgId={192} align="right" />
        <IndustryCard title="DEFENSE" imgId={203} align="left" />
      </div>
    </motion.div>
  );
};

export default Industries;