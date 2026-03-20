import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { pageTransitionVariants, NEON_GREEN, fadeInUp, staggerContainer } from '../constants';
import { ArrowDown, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import NeuralCortex from '../components/NeuralCortex';
import VelocityScroll from '../components/VelocityScroll';
import ScrambleText from '../components/ScrambleText';

const StatBlock: React.FC<{ label: string; value: string; delay?: number }> = ({ label, value, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col border-l border-white/20 pl-4 py-1"
  >
    <span className="font-mono text-[10px] text-white/40 tracking-wider mb-1">{label}</span>
    <span className="font-mono text-sm md:text-base text-[#CCFF00] font-bold">{value}</span>
  </motion.div>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; index: number }> = ({ title, desc, icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative border border-white/10 bg-[#0A0A0A] p-8 group overflow-hidden hover:border-[#CCFF00]/40 transition-colors duration-300"
  >
    {/* Hover Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/0 via-transparent to-[#CCFF00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Corner Accent */}
    <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
       <div className="w-2 h-2 border-t border-r border-[#CCFF00]" />
    </div>

    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-6 text-white/50 group-hover:text-[#CCFF00] group-hover:scale-110 transition-all duration-300 origin-left">
        {icon}
      </div>
      
      <h3 className="text-xl font-mono font-bold text-white mb-4 tracking-tight group-hover:text-[#CCFF00] transition-colors">
        <ScrambleText text={title} />
      </h3>
      
      <p className="text-white/60 text-sm font-light leading-relaxed flex-grow">
        {desc}
      </p>

      {/* Decorative Line */}
      <div className="w-12 h-[1px] bg-white/10 mt-6 group-hover:w-full group-hover:bg-[#CCFF00]/30 transition-all duration-500" />
    </div>
  </motion.div>
);

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects for Hero Content
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Smooth scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const scaleX = useSpring(scrollYProgress, {
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
      className="relative z-10 w-full"
      ref={containerRef}
    >
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-[2px] bg-[#CCFF00] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* --- HERO SECTION WITH 3D NEURAL CORTEX --- */}
      <section className="h-screen relative flex flex-col justify-center items-center overflow-hidden">
        
        {/* The 3D Component */}
        <NeuralCortex />

        {/* The Overlay Content */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 pointer-events-none" // pointer-events-none ensures mouse reaches the canvas
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 border border-[#CCFF00]/30 bg-[#CCFF00]/5 px-3 py-1 rounded-sm mb-8 backdrop-blur-md pointer-events-auto">
            <span className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#CCFF00]">SYSTEM ONLINE</span>
          </div>

          {/* Headline - Removed Mix-Blend-Mode for better visibility, added Shadow */}
          <h1 className="text-5xl md:text-9xl font-bold font-mono tracking-tighter leading-[0.85] mb-8 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] pointer-events-auto">
            THE <ScrambleText text="PREFRONTAL" /> <br />
            <ScrambleText text="CORTEX" /> FOR <br />
            <ScrambleText text="EDGE ROBOTICS" />
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-md">
            Synthesizing Computational Neuroscience with Control Theory.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widest">SCROLL TO INITIALIZE</span>
          <ArrowDown size={16} />
        </motion.div>
      </section>

      {/* --- KINETIC TYPOGRAPHY SCROLL --- */}
      <VelocityScroll />

      {/* --- MANIFESTO SECTION --- */}
      {/* Changed bg to gradient/transparent to reveal global background */}
      <section className="min-h-screen bg-gradient-to-b from-transparent via-black/90 to-black relative z-20 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="border-l-2 border-[#CCFF00] pl-8 mb-32">
            <motion.h2 
              initial={{ opacity: 0.2 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-20%" }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-6xl font-mono leading-tight tracking-tight text-white drop-shadow-lg"
            >
              STANDARD LLMs HALLUCINATE. <br/>
              <span className="text-[#CCFF00]"><ScrambleText text="ATMA REASONS." /></span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20%" }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-8 text-xl md:text-2xl text-white/60 font-light max-w-3xl drop-shadow-md"
            >
              We are building the first neuro-symbolic architecture designed specifically for GPS-denied, high-stakes environments where "approximate" is not enough.
            </motion.p>
          </div>

          {/* Feature Grid - KEY CAPABILITIES */}
          <div className="grid md:grid-cols-3 gap-6 mb-40">
            <FeatureCard 
              index={0}
              title="DETERMINISTIC LOGIC"
              desc="Unlike probabilistic transformers, our symbolic solver guarantees logical consistency in critical decision paths."
              icon={<BrainCircuit size={32} />}
            />
            <FeatureCard 
              index={1}
              title="EDGE NATIVE"
              desc="Running full inference on Jetson Orin at <15ms latency. No cloud dependency. No lag."
              icon={<Zap size={32} />}
            />
            <FeatureCard 
              index={2}
              title="VERIFIABLE SAFETY"
              desc="Mathematical bounds on agent behavior ensure safety compliance in industrial & defense sectors."
              icon={<ShieldCheck size={32} />}
            />
          </div>
        </div>

        {/* --- FOOTER STATS --- */}
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-12 pb-12 bg-black/40 backdrop-blur-sm rounded-t-xl px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            <StatBlock label="LATENCY" value="<15ms" delay={0.1} />
            <StatBlock label="HARDWARE" value="JETSON ORIN" delay={0.2} />
            <StatBlock label="MODEL" value="NEURO-SYMBOLIC" delay={0.3} />
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col justify-end text-right"
            >
               <span className="font-mono text-[10px] text-white/30 tracking-widest mb-1">STATUS</span>
               <span className="font-mono text-sm text-[#CCFF00]">OPERATIONAL</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;