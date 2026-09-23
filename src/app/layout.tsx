import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { profile } from '@/data/profile';
import './globals.css';

export const metadata: Metadata = {
  title: `${profile.name} — Design × Development`,
  description: 'UI/UX design, graphic design, frontend development and digital marketing. Explore Ashwin Issac Shaji’s work, experience and creative practice.',
  authors: [{ name: profile.name }],
  openGraph: { title: `${profile.name} — Design × Development`, description: profile.bio, type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary', title: `${profile.name} — Design × Development`, description: profile.bio },
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Oswald:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
