import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NEON_GREEN, NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { RoutePath } from '../types';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputValue.trim()) {
        setSearchQuery(inputValue.trim());
        navigate(RoutePath.SEARCH);
        setInputValue('');
        inputRef.current?.blur();
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-6 md:py-6 select-none pointer-events-none">
      <div className="max-w-7xl mx-auto bg-[#050505]/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-3xl md:rounded-full pointer-events-auto transition-all duration-300">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-1 group" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-mono text-lg font-bold tracking-tighter text-white">
              ATMA_AI
            </span>
            <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-[#CCFF00]"
            />
          </NavLink>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white/80 hover:text-[#CCFF00] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4 lg:gap-8">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink 
                    key={item.path} 
                    to={item.path}
                    className="relative text-xs font-mono tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#CCFF00] transition-colors" size={14} />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="SEARCH (CMD+K)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-32 lg:w-48 focus:w-48 lg:focus:w-64 bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#CCFF00]/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-6 pb-4 border-t border-white/10 mt-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-sm font-mono tracking-widest transition-colors ${isActive ? 'text-[#CCFF00]' : 'text-white/60 hover:text-white'}`}
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
                
                {/* Mobile Search Bar */}
                <div className="relative group mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#CCFF00] transition-colors" size={14} />
                  <input 
                    type="text" 
                    placeholder="SEARCH..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#CCFF00]/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;