'use client';

import { useState } from 'react';
import { lookbookData, LookbookEntry } from '@/data/lookbook-data';
import { LookbookHero } from '@/components/lookbook/LookbookHero';
import { LookbookGallery } from '@/components/lookbook/LookbookGallery';
import { LookbookModal } from '@/components/lookbook/LookbookModal';
import { LookbookCTA } from '@/components/lookbook/LookbookCTA';

export default function LookbookClient() {
  const [activeEntry, setActiveEntry] = useState<LookbookEntry | null>(null);

  const handleNext = () => {
    if (!activeEntry) return;
    const currentIndex = lookbookData.findIndex(e => e.id === activeEntry.id);
    const nextIndex = (currentIndex + 1) % lookbookData.length;
    setActiveEntry(lookbookData[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeEntry) return;
    const currentIndex = lookbookData.findIndex(e => e.id === activeEntry.id);
    const prevIndex = (currentIndex - 1 + lookbookData.length) % lookbookData.length;
    setActiveEntry(lookbookData[prevIndex]);
  };

  return (
    <>
      <div className="bg-[#050505] min-h-screen">
        <LookbookHero />
        <LookbookGallery entries={lookbookData} onOpenModal={setActiveEntry} />
        <LookbookCTA />
      </div>
      
      <LookbookModal 
        entry={activeEntry} 
        onClose={() => setActiveEntry(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
