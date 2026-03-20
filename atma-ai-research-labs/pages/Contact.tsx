import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransitionVariants, fadeInUp, staggerContainer, NEON_GREEN } from '../constants';
import { Mail, MapPin, Send, Loader2, AlertTriangle, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    let isValid = true;

    if (!formState.name.trim()) {
      newErrors.name = 'ERR_NAME_REQUIRED';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim()) {
      newErrors.email = 'ERR_EMAIL_REQUIRED';
      isValid = false;
    } else if (!emailRegex.test(formState.email)) {
      newErrors.email = 'ERR_INVALID_FORMAT';
      isValid = false;
    }

    if (!formState.message.trim()) {
      newErrors.message = 'ERR_MSG_EMPTY';
      isValid = false;
    } else if (formState.message.length < 10) {
      newErrors.message = 'ERR_MSG_TOO_SHORT';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    setIsError(false);
    
    // Simulate network transmission delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random failure (30% chance) to demonstrate error handling
    const hasError = Math.random() < 0.3;
    
    if (hasError) {
      setIsError(true);
    } else {
      setIsError(false);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setIsError(false);
    // We do NOT clear the form state here, allowing the user to try again immediately
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIsError(false);
    setFormState({ name: '', email: '', message: '' });
    setErrors({});
  };

  const terminalLine = {
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Info */}
          <div>
             <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-12">
              LET'S BUILD THE <br/>
              <span style={{ color: NEON_GREEN }}>PREFRONTAL CORTEX</span> <br/>
              FOR AI.
            </motion.h1>

            <motion.div variants={fadeInUp} className="space-y-8 border-t border-white/20 pt-8">
              <div className="space-y-2">
                <h3 className="font-mono text-xs text-white/50 tracking-widest">INQUIRIES</h3>
                
                {/* Enhanced Email Link */}
                <motion.a 
                  href="mailto:ceo@gmail.com" 
                  className="flex items-center gap-3 text-xl font-mono w-fit group"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <motion.div
                    variants={{
                      rest: { color: "#E5E7EB" },
                      hover: { color: NEON_GREEN }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Mail size={20} />
                  </motion.div>
                  
                  <div className="relative flex items-center">
                    <motion.span
                      variants={{
                        rest: { color: "#E5E7EB", textShadow: "0 0 0px transparent" },
                        hover: { 
                          color: NEON_GREEN, 
                          textShadow: `0 0 12px ${NEON_GREEN}80`,
                        }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      ceo@gmail.com
                    </motion.span>
                    
                    {/* Blinking Cursor Effect */}
                    <motion.div
                      className="ml-2"
                      variants={{
                        rest: { opacity: 0 },
                        hover: { opacity: 1 }
                      }}
                    >
                      <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="w-2.5 h-5 bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]"
                      />
                    </motion.div>
                  </div>
                </motion.a>
              </div>

              <div className="space-y-2">
                <h3 className="font-mono text-xs text-white/50 tracking-widest">HQ</h3>
                <p className="flex items-center gap-3 text-xl text-white/80 font-mono">
                  <MapPin size={20} /> SF, California
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form with Terminal States */}
          <motion.div 
            variants={fadeInUp} 
            className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-sm backdrop-blur-sm min-h-[550px] flex flex-col justify-center relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <h3 className="font-mono text-xl text-white mb-8 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"/>
                    CONTACT_FORM
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className={`font-mono text-xs tracking-widest transition-colors ${errors.name ? 'text-red-500' : 'text-[#CCFF00]'}`}>NAME</label>
                        {errors.name && (
                          <span className="font-mono text-[10px] text-red-500 animate-pulse">
                            &gt;&gt; {errors.name}
                          </span>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={formState.name}
                        onChange={(e) => {
                          setFormState({...formState, name: e.target.value});
                          clearError('name');
                        }}
                        className={`w-full bg-black/50 border p-4 text-white font-mono outline-none transition-colors rounded-sm placeholder:text-white/20
                          ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#CCFF00]'}
                        `}
                        placeholder="ENTER YOUR NAME"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className={`font-mono text-xs tracking-widest transition-colors ${errors.email ? 'text-red-500' : 'text-[#CCFF00]'}`}>EMAIL</label>
                        {errors.email && (
                          <span className="font-mono text-[10px] text-red-500 animate-pulse">
                            &gt;&gt; {errors.email}
                          </span>
                        )}
                      </div>
                      <input 
                        type="email" 
                        value={formState.email}
                        onChange={(e) => {
                          setFormState({...formState, email: e.target.value});
                          clearError('email');
                        }}
                        className={`w-full bg-black/50 border p-4 text-white font-mono outline-none transition-colors rounded-sm placeholder:text-white/20
                          ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#CCFF00]'}
                        `}
                        placeholder="ENTER YOUR EMAIL"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className={`font-mono text-xs tracking-widest transition-colors ${errors.message ? 'text-red-500' : 'text-[#CCFF00]'}`}>MESSAGE</label>
                        {errors.message && (
                          <span className="font-mono text-[10px] text-red-500 animate-pulse">
                            &gt;&gt; {errors.message}
                          </span>
                        )}
                      </div>
                      <textarea 
                        rows={4}
                        value={formState.message}
                        onChange={(e) => {
                          setFormState({...formState, message: e.target.value});
                          clearError('message');
                        }}
                        className={`w-full bg-black/50 border p-4 text-white font-mono outline-none transition-colors rounded-sm resize-none placeholder:text-white/20
                          ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#CCFF00]'}
                        `}
                        placeholder="TYPE YOUR MESSAGE..."
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white/10 text-white hover:bg-[#CCFF00] hover:text-black border border-white/20 hover:border-[#CCFF00] font-mono font-bold py-4 px-8 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-pulse">SENDING...</span>
                          <Loader2 size={16} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : isError ? (
                // Error State View
                <motion.div
                  key="error"
                  initial="initial"
                  animate="animate"
                  variants={{
                    animate: {
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  className="w-full h-full flex flex-col justify-center font-mono"
                >
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex justify-center"
                  >
                     <div className="relative">
                       <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                       <XCircle className="relative z-10 text-red-500" size={80} strokeWidth={1} />
                     </div>
                  </motion.div>

                  <motion.div variants={terminalLine} className="space-y-2 mb-8 text-center md:text-left">
                     <p className="text-red-500/80 text-xs tracking-widest mb-4 flex items-center justify-center md:justify-start gap-2">
                        <AlertTriangle size={12} />
                        SYSTEM_ERROR_LOG:
                     </p>
                     <p className="text-white/70">&gt; INITIATING_HANDSHAKE...</p>
                     <p className="text-red-400">&gt; PACKET_LOSS_DETECTED [CRITICAL]</p>
                     <p className="text-red-400">&gt; CONNECTION_RESET_BY_PEER</p>
                  </motion.div>

                  <motion.div variants={terminalLine} className="border-l-2 border-red-500 pl-4 py-4 bg-red-500/5 mb-8">
                     <p className="text-red-500 font-bold text-lg leading-relaxed">
                       &gt; TRANSMISSION FAILED. <br/>
                       &gt; RETRY PROTOCOL AVAILABLE.
                     </p>
                  </motion.div>

                  <motion.div variants={terminalLine} className="pt-8 border-t border-white/10 flex flex-col items-center">
                     <button 
                        onClick={handleRetry}
                        className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 hover:border-red-500 font-mono font-bold py-4 px-8 transition-all duration-300 flex items-center justify-center gap-2"
                     >
                        <RefreshCcw size={16} />
                        RETRY_TRANSMISSION
                     </button>
                     <span className="mt-4 text-[10px] text-white/30">ERR_CODE: 0x{Math.floor(Math.random() * 999999).toString(16).toUpperCase()}</span>
                  </motion.div>
                </motion.div>
              ) : (
                // Success State View
                <motion.div
                  key="success"
                  initial="initial"
                  animate="animate"
                  variants={{
                    animate: {
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  className="w-full h-full flex flex-col justify-center font-mono"
                >
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex justify-center"
                  >
                     <div className="relative">
                       <div className="absolute inset-0 bg-[#CCFF00]/20 blur-xl rounded-full" />
                       <CheckCircle className="relative z-10 text-[#CCFF00]" size={80} strokeWidth={1} />
                     </div>
                  </motion.div>

                  <motion.div variants={terminalLine} className="space-y-2 mb-8 text-center md:text-left">
                     <p className="text-white/40 text-xs tracking-widest mb-4">SYSTEM_LOG_OUTPUT:</p>
                     <p className="text-white/70">&gt; INITIATING_HANDSHAKE...</p>
                     <p className="text-white/70">&gt; UPLINK_ESTABLISHED [SECURE]</p>
                     <p className="text-white/70">&gt; SENDING_PACKETS... [100%]</p>
                  </motion.div>

                  <motion.div variants={terminalLine} className="border-l-2 border-[#CCFF00] pl-4 py-4 bg-[#CCFF00]/5 mb-8">
                     <p className="text-[#CCFF00] font-bold text-lg leading-relaxed">
                       &gt; MESSAGE RECEIVED. <br/>
                       &gt; WE WILL RESPOND SHORTLY.
                     </p>
                  </motion.div>

                  <motion.div variants={terminalLine} className="pt-8 border-t border-white/10 flex flex-col items-center">
                     <button 
                        onClick={handleReset}
                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-mono py-4 px-8 transition-all duration-300 flex items-center justify-center gap-2"
                     >
                        SEND ANOTHER MESSAGE
                     </button>
                     <span className="mt-4 text-[10px] text-white/30">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;