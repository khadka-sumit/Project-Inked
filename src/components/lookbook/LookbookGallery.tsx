'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { LookbookEntry } from '@/data/lookbook-data';
import { useMediaQuery } from '@/lib/hooks/useResponsive';

interface LookbookGalleryProps {
  entries: LookbookEntry[];
  onOpenModal: (entry: LookbookEntry) => void;
}

export function LookbookGallery({ entries, onOpenModal }: LookbookGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useGSAP(() => {
    if (!isDesktop || !containerRef.current || !scrollWrapperRef.current) return;

    // Horizontal scroll effect on desktop
    const sections = gsap.utils.toArray('.lookbook-slide');
    
    // Calculate total scroll distance
    const getScrollAmount = () => {
      let scrollWidth = scrollWrapperRef.current?.scrollWidth || 0;
      return -(scrollWidth - window.innerWidth);
    };

    const tween = gsap.to(sections, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    // Image parallax effect inside slides
    sections.forEach((section: any) => {
      const img = section.querySelector('.lookbook-img');
      if (img) {
        gsap.to(img, {
          x: () => (window.innerWidth * 0.1),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef, dependencies: [isDesktop] });

  // Mobile layout (vertical stacked)
  if (!isDesktop) {
    return (
      <section className="py-12 bg-[#050505]">
        <div className="container-custom flex flex-col gap-12">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="flex flex-col gap-4 cursor-pointer"
              onClick={() => onOpenModal(entry)}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#7A1111] mb-1">{entry.campaign}</p>
                <h3 className="font-display text-3xl text-[#F2EEE7] mb-2">{entry.title}</h3>
                <p className="text-sm text-[#8A8A8A] leading-relaxed">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop layout (horizontal scroll)
  return (
    <section ref={containerRef} className="h-screen bg-[#050505] overflow-hidden relative">
      <div 
        ref={scrollWrapperRef}
        className="flex h-full w-[max-content] pt-32 pb-20 px-[10vw]"
      >
        {entries.map((entry, index) => (
          <div 
            key={entry.id} 
            className="lookbook-slide w-[80vw] md:w-[60vw] lg:w-[45vw] h-full flex flex-col shrink-0 mr-[10vw] last:mr-0 group cursor-pointer"
            onClick={() => onOpenModal(entry)}
          >
            <div className="relative flex-1 overflow-hidden bg-[#111]">
              {/* Fake cursor hint on hover */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="bg-[#F2EEE7] text-[#050505] px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold">
                  View Detail
                </span>
              </div>
              
              <Image
                src={entry.image}
                alt={entry.title}
                fill
                className="lookbook-img object-cover scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="mt-8 grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7A1111]">{entry.campaign}</p>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mt-2">
                  No. {String(index + 1).padStart(2, '0')}
                </p>
              </div>
              <div className="col-span-8">
                <h3 className="font-display text-4xl text-[#F2EEE7] mb-4 group-hover:text-[#7A1111] transition-colors duration-300">{entry.title}</h3>
                <p className="text-sm text-[#8A8A8A] leading-relaxed max-w-sm">{entry.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
