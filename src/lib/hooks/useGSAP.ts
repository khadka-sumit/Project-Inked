'use client';

import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { useEffect } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}


// Custom hook to kill all scroll triggers on unmount if needed
export const useScrollTrigger = () => {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

export { useGSAP, gsap, ScrollTrigger };
