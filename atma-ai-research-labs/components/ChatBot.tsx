import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Terminal, Minimize2, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { NEON_GREEN } from '../constants';

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for ATMA AI (Atmospheric & Terrestrial Machine Autonomy). 
Your goal is to explain ATMA AI's technology, vision, and investment potential to visitors.

CORE CONTEXT (FROM PITCH DECK):
1. **Mission**: "Making AI small enough for a chip, smart enough for the world." We solve the 'Hallucination' and 'Latency' crisis in autonomous systems.
2. **The Problem**: 
   - Standard GenAI/LLMs hallucinate and lack a 'World Model' (dangerous for robotics).
   - Cloud dependence causes latency (fatal for drones).
   - Privacy risks for defense/industrial video feeds.
3. **The Solution (Neuro-Symbolic Reasoning)**:
   - We move from "Probabilistic Guessing" to "Deterministic Reasoning".
   - Architecture: Slot-Attention Encoder (extracts objects) -> Latent World Model (physics simulation) -> Deterministic Solver (logic verification).
   - Result: Robots that understand physics and don't crash when Wi-Fi is lost.
4. **Hardware & Performance**:
   - Edge Native: Purpose-built for NVIDIA Jetson Orin and Edge TPUs.
   - Power: <15W power envelope.
   - Latency: <15ms response time (Zero Latency).
5. **Target Markets**: 
   - Autonomous Drones (GPS-denied navigation).
   - Industrial Robotics (Adaptive manipulation).
   - Defense Systems (Jamming-resistant, air-gapped).
   - Consumer Edge AI (Private smart home assistants).
6. **Roadmap**:
   - 2024 Q4: Seed Foundation (Alpha trained).
   - 2026 Q2: Jetson Prototype (Symbolic Integration).
   - 2026 Q4: Commercial Pilot (Drone pilots).
   - 2027: Public Launch (Developer SDK).
7. **Team**: 
   - Abhishek Singh (Founder, Ex-ZedBlock).
   - Avadhesh Kumar (Lead Architect, IIT Delhi).
8. **Investment Ask**: Funds for NVIDIA hardware, Cloud GPU credits (A100s), and Pilot Trials.

TONE:
- Tech-forward, professional, precise, slightly futuristic ("Void Tech").
- Use bullet points for clarity.
- If asked about pricing or specific deals, direct them to contact: ceo@gmail.com.
`;

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "SYSTEM_ONLINE. I am the ATMA AI neural interface. Ask me about our neuro-symbolic architecture or investment roadmap." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize AI client - assumes process.env.API_KEY is available
  const aiRef = useRef<any>(null);

  useEffect(() => {
    try {
        // Safe check for environment variable, though it should be handled by build process
        const apiKey = process.env.API_KEY; 
        if (apiKey) {
            const client = new GoogleGenAI({ apiKey });
            aiRef.current = client;
        }
    } catch (e) {
        console.error("Failed to initialize AI client", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    if (!aiRef.current) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "ERROR: AI_CORE_OFFLINE. Missing API configuration." 
      }]);
      setInputValue('');
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const model = aiRef.current.models;
      
      // Create chat history for context, excluding the initial greeting if it's the first message
      const history = messages
        .filter(m => m.id !== 'init')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      // Start streaming request
      const response = await model.generateContentStream({
        model: 'gemini-3-flash-preview', // Updated to use correct model from guidelines
        contents: [...history, { role: 'user', parts: [{ text: userMsg.text }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      // Placeholder for bot response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      let fullText = '';
      
      for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setMessages(prev => 
            prev.map(msg => msg.id === botMsgId ? { ...msg, text: fullText } : msg)
          );
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "ERROR: CONNECTION_INTERRUPTED. Please verify API configuration." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-4 w-[calc(100vw-3rem)] md:w-[400px] max-w-[400px] h-[500px] max-h-[calc(100vh-8rem)] bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#CCFF00]" />
                  <span className="font-mono text-xs tracking-widest text-white/80">ATMA_NEURAL_LINK</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <Minimize2 size={16} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3 rounded-sm border ${
                        msg.role === 'user' 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-[#CCFF00]/5 border-[#CCFF00]/20 text-[#CCFF00]'
                      }`}
                    >
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px]">
                          <Bot size={10} />
                          <span>AI_NODE</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 p-3 rounded-sm flex items-center gap-2">
                      <Sparkles size={14} className="text-[#CCFF00] animate-pulse" />
                      <span className="text-[#CCFF00] text-xs animate-pulse">COMPUTING...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-black/40">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="ENTER QUERY..."
                    className="flex-1 bg-transparent border border-white/20 rounded-sm px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#CCFF00] placeholder:text-white/20 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-[#CCFF00] text-black p-2 rounded-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Trigger Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#050505] border border-[#CCFF00]/50 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all duration-300 overflow-hidden"
        >
          {/* Scanning Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#CCFF00]/20 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000" />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="text-[#CCFF00]" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageSquare className="text-[#CCFF00]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default ChatBot;