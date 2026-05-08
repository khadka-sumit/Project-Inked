/**
 * Responsive hooks and utilities
 */

import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    ...size,
    isMobile: mounted && size.width < BREAKPOINTS.SM,
    isTablet: mounted && size.width >= BREAKPOINTS.SM && size.width < BREAKPOINTS.LG,
    isDesktop: mounted && size.width >= BREAKPOINTS.LG,
  };
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

export const useMobile = () =>
  useMediaQuery(`(max-width: ${BREAKPOINTS.SM - 1}px)`);
export const useTablet = () =>
  useMediaQuery(`(min-width: ${BREAKPOINTS.SM}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`);
export const useDesktop = () =>
  useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);

export const useReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
