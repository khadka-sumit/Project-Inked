'use client';

import { useEffect, useRef, type PropsWithChildren } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      syncTouch: true,
      infinite: false,
      autoRaf: false,
    });

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    let animationFrame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length && typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);

    lenisRef.current = lenis;
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', refresh);
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenisRef.current = null;
    };
  }, []);

  return (
    <div data-scroll-container className="overflow-hidden">
      {children}
    </div>
  );
}
