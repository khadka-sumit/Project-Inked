'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { LookbookEntry } from '@/data/lookbook-data';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/animation/gsap';

interface LookbookModalProps {
  entry: LookbookEntry | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function LookbookModal({ entry, onClose, onNext, onPrev }: LookbookModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on escape, navigate on arrows
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') onClose(); 
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, onNext, onPrev]);

  // Lock body scroll
  useEffect(() => {
    if (entry) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [entry]);

  // Entry animation
  useGSAP(() => {
    if (entry && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [entry]);

  if (!entry) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl p-4 sm:p-8"
      style={{ animation: 'fadeIn 0.3s ease' }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 text-[#8A8A8A] hover:text-[#F2EEE7] uppercase tracking-[0.2em] text-xs transition-colors"
      >
        Close [ESC]
      </button>

      {/* Nav buttons */}
      <button 
        onClick={onPrev}
        className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-[#2a2a2a] rounded-full text-[#F2EEE7] hover:border-[#7A1111] hover:text-[#7A1111] transition-all bg-[#050505]/50 backdrop-blur"
      >
        ←
      </button>
      <button 
        onClick={onNext}
        className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-[#2a2a2a] rounded-full text-[#F2EEE7] hover:border-[#7A1111] hover:text-[#7A1111] transition-all bg-[#050505]/50 backdrop-blur"
      >
        →
      </button>

      <div 
        ref={contentRef}
        className="relative w-full max-w-6xl h-[85vh] flex flex-col md:flex-row gap-8 items-center"
      >
        {/* Main Image */}
        <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-[#111] overflow-hidden">
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 66vw"
            quality={100}
          />
        </div>

        {/* Details Sidebar */}
        <div className="w-full md:w-1/3 flex flex-col gap-8 h-auto max-h-[50vh] md:max-h-none overflow-y-auto pr-4 custom-scrollbar">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#7A1111] mb-2">{entry.campaign}</p>
            <h2 className="font-display text-4xl sm:text-5xl text-[#F2EEE7] leading-tight mb-4">{entry.title}</h2>
            <p className="text-[#8A8A8A] text-sm leading-relaxed">{entry.description}</p>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-sm">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#555] mb-4">Garments in this look</h4>
            <ul className="space-y-3">
              {entry.products.map((prod, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#7A1111] mt-1 text-[8px]">■</span>
                  <span className="text-sm text-[#F2EEE7] uppercase tracking-wider">{prod}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href="/shop" 
              className="mt-8 block w-full py-3 border border-[#333] text-center text-xs uppercase tracking-[0.2em] text-[#F2EEE7] hover:bg-[#F2EEE7] hover:text-[#050505] transition-colors"
            >
              Shop The Drop
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
