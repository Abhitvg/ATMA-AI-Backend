import React from 'react';
import { motion } from 'framer-motion';
import { NEON_GREEN } from '../constants';
import { MapPin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-[#050505]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        
        {/* Copyright */}
        <div className="font-mono text-[10px] text-white/30 tracking-widest order-3 md:order-1">
          © 2026 ATMA AI LABS. ALL RIGHTS RESERVED.
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-white/50 tracking-widest order-2 hover:text-white transition-colors duration-300 cursor-default">
           <MapPin size={10} className="text-[#CCFF00]" />
           <span>SF, CALIFORNIA</span>
        </div>

        {/* Contact Link */}
        <div className="order-1 md:order-3">
          <motion.a 
            href="mailto:ceo@gmail.com" 
            className="group flex items-center gap-2 font-mono text-xs"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <Mail size={12} className="text-white/40 group-hover:text-[#CCFF00] transition-colors duration-300" />
            <motion.span
              variants={{
                rest: { color: "rgba(255,255,255,0.4)", textShadow: "0 0 0px transparent" },
                hover: { 
                  color: NEON_GREEN, 
                  textShadow: `0 0 12px ${NEON_GREEN}`,
                }
              }}
              transition={{ duration: 0.3 }}
            >
              ceo@gmail.com
            </motion.span>
          </motion.a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;