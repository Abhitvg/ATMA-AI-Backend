import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Home from './pages/Home';
import Technology from './pages/Technology';
import Team from './pages/Team';
import Roadmap from './pages/Roadmap';
import Contact from './pages/Contact';
import UseCases from './pages/UseCases';
import SearchResults from './pages/SearchResults';
import ChatBot from './components/ChatBot';
import { RoutePath } from './types';
import { SearchProvider } from './context/SearchContext';


const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path={RoutePath.HOME} element={<Home />} />
        <Route path={RoutePath.TECHNOLOGY} element={<Technology />} />
        <Route path={RoutePath.USE_CASES} element={<UseCases />} />
        <Route path={RoutePath.TEAM} element={<Team />} />
        <Route path={RoutePath.ROADMAP} element={<Roadmap />} />
        <Route path={RoutePath.CONTACT} element={<Contact />} />
        <Route path={RoutePath.SEARCH} element={<SearchResults />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <SearchProvider>
        <div className="relative w-full min-h-screen flex flex-col text-[#E5E7EB] bg-[#050505] overflow-x-hidden selection:bg-[#CCFF00] selection:text-black">
          {/* Persistent Background Shell */}
          <div className="fixed inset-0 z-0">
            <Experience />
          </div>
          
          {/* Persistent Navigation */}
          <Navbar />

          {/* Content Area */}
          <main className="relative z-10 w-full flex-grow min-h-screen">
            <AnimatedRoutes />
          </main>

          {/* Footer */}
          <Footer />

          {/* AI Assistant */}
          <ChatBot />
        </div>
      </SearchProvider>
    </HashRouter>
  );
};

export default App;