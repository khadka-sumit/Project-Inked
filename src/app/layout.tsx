import type { Metadata } from 'next';
import { Space_Grotesk, Abril_Fatface } from 'next/font/google';
import '@/styles/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const abrilFatface = Abril_Fatface({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'PROJECT INKED - Limited Clothing Drops',
  description:
    'Wearable ink. Limited marks. PROJECT INKED is where garment, graphic, and identity collide.',
  metadataBase: new URL('https://projectinked.com'),
  openGraph: {
    title: 'PROJECT INKED - Limited Clothing Drops',
    description:
      'Wearable ink. Limited marks. PROJECT INKED is where garment, graphic, and identity collide.',
    type: 'website',
  },
};

import { AppShell } from '@/components/layout/AppShell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${abrilFatface.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body className="bg-ink text-bone overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
