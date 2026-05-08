import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const useGSAPContext = () => {
  useEffect(() => {
    return () => {
      // Cleanup ScrollTrigger on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};
