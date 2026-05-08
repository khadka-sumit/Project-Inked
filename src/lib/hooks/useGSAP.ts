/**
 * useGSAP hook and utilities
 * Safe wrapper for GSAP animations in React
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const contextRef = useRef<gsap.Context>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation setup happens here
    });

    contextRef.current = ctx;

    return () => {
      // Cleanup
      ctx.revert();
    };
  }, []);

  return contextRef.current;
};

export const useScrollTrigger = () => {
  useEffect(() => {
    return () => {
      // Cleanup all ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

export { gsap, ScrollTrigger };
