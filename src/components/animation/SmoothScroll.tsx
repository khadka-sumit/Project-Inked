'use client';

import { useEffect, useRef, type PropsWithChildren } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { usePathname } from 'next/navigation';

export function SmoothScroll({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoRaf: false, // Critical for GSAP ticker integration
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on every GSAP tick
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Need to turn off lag smoothing to prevent jitter when using native scrolling
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenisRef.current = null;
    };
  }, []);

  // Refresh ScrollTrigger on route change to prevent misalignments
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div data-scroll-container className="overflow-hidden">
      {children}
    </div>
  );
}
