'use client';

import { gsap, ScrollTrigger } from './gsap';
import { useEffect } from 'react';

export const useGSAPContext = () => {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

export { gsap, ScrollTrigger };
