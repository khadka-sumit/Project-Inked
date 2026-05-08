'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/animation/gsap';

export function LookbookHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.hero-text-char',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.2 }
    )
    .fromTo(
      '.hero-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo(
      '.hero-scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );
  }, { scope: containerRef });

  const titleChars = 'LOOKBOOK'.split('');

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#050505] overflow-hidden px-4"
    >
      <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
      
      <div className="z-10 text-center">
        <h1 className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tight text-[#F2EEE7] flex overflow-hidden">
          {titleChars.map((char, index) => (
            <span key={index} className="hero-text-char inline-block">
              {char}
            </span>
          ))}
        </h1>
        <p className="hero-subtitle mt-8 text-[#8A8A8A] text-sm uppercase tracking-[0.5em] max-w-md mx-auto">
          Garments as marks.<br/>Fabric as memory.
        </p>
      </div>

      <div className="hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.4em] text-[#555]">Scroll to Explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-[#555] to-transparent overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[#F2EEE7] -translate-y-full animate-[slideDown_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
