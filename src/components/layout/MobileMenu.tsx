'use client';

import { useEffect } from 'react';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink bg-opacity-95 backdrop-blur-md text-bone">
      <div className="container-custom flex h-full flex-col justify-between py-8">
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-[0.4em] text-grey">PROJECT INKED</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="px-4 py-3 text-base uppercase tracking-[0.3em] text-bone transition-colors duration-200 hover:text-red-accent"
          >
            Close
          </button>
        </div>

        <nav className="space-y-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block text-4xl font-display uppercase tracking-[0.2em] text-bone transition-colors duration-200 hover:text-red-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="space-y-4 border-t border-grey-dark pt-6 text-sm text-grey">
          <p>Shipping worldwide from the underground.</p>
          <p>Limited drops. Fast access.</p>
        </div>
      </div>
    </div>
  );
}
