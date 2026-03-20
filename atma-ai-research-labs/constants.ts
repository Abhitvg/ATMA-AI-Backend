import { RoutePath } from './types';

export const NEON_GREEN = '#CCFF00'; // "Aldenaire Green"
export const DARK_BG = '#050505';
export const TEXT_MAIN = '#E5E7EB';

export const NAV_ITEMS = [
  { label: 'HOME', path: RoutePath.HOME },
  { label: 'ARCHITECTURE', path: RoutePath.TECHNOLOGY },
  { label: 'USE CASES', path: RoutePath.USE_CASES },
  { label: 'ENGINEERS', path: RoutePath.TEAM },
  { label: 'ROADMAP', path: RoutePath.ROADMAP },
  { label: 'CONTACT', path: RoutePath.CONTACT },
];

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    } 
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number]
    }
  }
};