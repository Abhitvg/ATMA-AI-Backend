import React, { useState } from 'react';

const ROICalculatorWidget = () => {
  const [employees, setEmployees] = useState(50);
  const [hourlyWage, setHourlyWage] = useState(30);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Assumptions
  const weeksPerYear = 50;
  const aiEfficiencyGain = 0.6; // AI reduces repetitive task time by 60%
  
  const currentCost = employees * hourlyWage * hoursPerWeek * weeksPerYear;
  const savings = currentCost * aiEfficiencyGain;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // In a real app, this would call our backend proposal generator
    try {
      await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          metrics: { employees, hourlyWage, hoursPerWeek, currentCost, savings }
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit", err);
    }
  };

  if (submitted) {
    return (
      <div className="bg-primary-dark/50 border border-accent/20 rounded-2xl p-8 max-w-md mx-auto text-center glass-card">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-primary-light mb-2">Proposal Generated!</h3>
        <p className="text-muted">We've sent a customized implementation plan and ROI breakdown to <strong>{email}</strong>.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 blur-[60px] rounded-full pointer-events-none"></div>
      
      <div className="mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">Calculate Your AI ROI</h2>
        <p className="text-gray-400 text-sm">Discover how much you can save by automating repetitive enterprise workflows.</p>
      </div>

      <div className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Employees (Data/Operations)
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="5" 
              max="500" 
              value={employees} 
              onChange={(e) => setEmployees(Number(e.target.value))}
              className="w-full accent-[#00E5FF]"
            />
            <span className="text-white font-mono bg-white/5 px-3 py-1 rounded-md min-w-[60px] text-center">{employees}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Average Hourly Wage ($)
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="15" 
              max="150" 
              value={hourlyWage} 
              onChange={(e) => setHourlyWage(Number(e.target.value))}
              className="w-full accent-[#00E5FF]"
            />
            <span className="text-white font-mono bg-white/5 px-3 py-1 rounded-md min-w-[60px] text-center">${hourlyWage}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hours/Week on Manual Tasks
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="2" 
              max="30" 
              value={hoursPerWeek} 
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-[#00E5FF]"
            />
            <span className="text-white font-mono bg-white/5 px-3 py-1 rounded-md min-w-[60px] text-center">{hoursPerWeek}h</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00E5FF]/10 to-blue-500/10 border border-[#00E5FF]/20 rounded-xl p-5 mt-6">
          <p className="text-sm text-gray-400 mb-1">Estimated Annual Savings</p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-400">
            ${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500 mt-2">*Based on 60% automation of repetitive tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Get your detailed implementation plan
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              required
              placeholder="work@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
            <button 
              type="submit"
              className="bg-[#00E5FF] text-black font-semibold px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all whitespace-nowrap"
            >
              Send Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ROICalculatorWidget;
