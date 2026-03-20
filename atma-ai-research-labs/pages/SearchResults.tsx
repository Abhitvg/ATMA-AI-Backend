import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageTransitionVariants, fadeInUp, staggerContainer, NEON_GREEN } from '../constants';
import { useSearch } from '../context/SearchContext';
import { TECH_ITEMS, USE_CASES, TEAM_MEMBERS, ROADMAP_MILESTONES } from '../data';
import { RoutePath } from '../types';
import { ArrowRight, Box, Search as SearchIcon } from 'lucide-react';

const ResultSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-12">
    <h3 className="text-xs font-mono tracking-widest text-[#CCFF00] mb-6 border-b border-[#CCFF00]/20 pb-2 inline-block">
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ResultItem: React.FC<{ title: string; subtitle?: string; desc: string; link: string; type: string }> = ({ title, subtitle, desc, link, type }) => (
  <motion.div 
    variants={fadeInUp}
    className="group relative border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
  >
    <Link to={link} className="block">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60 font-mono group-hover:bg-[#CCFF00] group-hover:text-black transition-colors">{type}</span>
            <h4 className="text-xl font-bold font-mono text-white group-hover:text-[#CCFF00] transition-colors">{title}</h4>
          </div>
          {subtitle && <p className="text-xs text-white/50 font-mono mb-2">{subtitle}</p>}
          <p className="text-sm text-white/70 line-clamp-2">{desc}</p>
        </div>
        <ArrowRight className="text-white/20 group-hover:text-[#CCFF00] group-hover:translate-x-1 transition-all" size={20} />
      </div>
    </Link>
  </motion.div>
);

const SearchResults: React.FC = () => {
  const { searchQuery } = useSearch();

  const results = useMemo(() => {
    if (!searchQuery) return { tech: [], cases: [], team: [], roadmap: [] };
    const lowerQuery = searchQuery.toLowerCase();

    return {
      tech: TECH_ITEMS.filter(i => 
        i.title.toLowerCase().includes(lowerQuery) || 
        i.subtitle.toLowerCase().includes(lowerQuery)
      ),
      cases: USE_CASES.filter(i => 
        i.title.toLowerCase().includes(lowerQuery) || 
        i.sector.toLowerCase().includes(lowerQuery) || 
        i.problem.toLowerCase().includes(lowerQuery) || 
        i.solution.toLowerCase().includes(lowerQuery)
      ),
      team: TEAM_MEMBERS.filter(i => 
        i.name.toLowerCase().includes(lowerQuery) || 
        i.role.toLowerCase().includes(lowerQuery) || 
        i.specs.toLowerCase().includes(lowerQuery)
      ),
      roadmap: ROADMAP_MILESTONES.filter(i => 
        i.title.toLowerCase().includes(lowerQuery) || 
        i.description.toLowerCase().includes(lowerQuery)
      )
    };
  }, [searchQuery]);

  const hasResults = Object.values(results).some(arr => arr.length > 0);

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen pt-32 px-6 pb-20"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          
          <div className="mb-16 border-b border-white/10 pb-8">
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mb-4">
              SEARCH_QUERY
            </h2>
            <div className="flex items-center gap-4 text-xl font-mono text-white/60">
              <SearchIcon size={20} className="text-[#CCFF00]" />
              <span>"{searchQuery}"</span>
            </div>
          </div>

          {!hasResults ? (
            <motion.div variants={fadeInUp} className="py-20 text-center border border-dashed border-white/10 bg-white/5 rounded-lg">
              <Box className="mx-auto text-white/20 mb-4" size={48} />
              <h3 className="text-xl text-white font-mono mb-2">NO DATA FRAGMENTS FOUND</h3>
              <p className="text-white/40 font-mono text-sm">TRY REFINING YOUR SEARCH PARAMETERS.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {results.tech.length > 0 && (
                <ResultSection title="SYSTEM ARCHITECTURE">
                  {results.tech.map((item, i) => (
                    <ResultItem 
                      key={i} 
                      type="TECH" 
                      title={item.title} 
                      desc={item.subtitle} 
                      link={RoutePath.TECHNOLOGY} 
                    />
                  ))}
                </ResultSection>
              )}

              {results.cases.length > 0 && (
                <ResultSection title="OPERATIONAL SCENARIOS">
                  {results.cases.map((item, i) => (
                    <ResultItem 
                      key={i} 
                      type="USE CASE" 
                      title={item.title} 
                      subtitle={item.sector} 
                      desc={item.solution} 
                      link={RoutePath.USE_CASES} 
                    />
                  ))}
                </ResultSection>
              )}

              {results.team.length > 0 && (
                <ResultSection title="PERSONNEL">
                  {results.team.map((item, i) => (
                    <ResultItem 
                      key={i} 
                      type="TEAM" 
                      title={item.name} 
                      subtitle={item.role} 
                      desc={item.specs} 
                      link={RoutePath.TEAM} 
                    />
                  ))}
                </ResultSection>
              )}

              {results.roadmap.length > 0 && (
                <ResultSection title="TIMELINE EVENTS">
                  {results.roadmap.map((item, i) => (
                    <ResultItem 
                      key={i} 
                      type="ROADMAP" 
                      title={item.title} 
                      subtitle={`${item.quarter} ${item.year}`} 
                      desc={item.description} 
                      link={RoutePath.ROADMAP} 
                    />
                  ))}
                </ResultSection>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchResults;