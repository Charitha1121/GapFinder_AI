import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'iGebra | Your learning workspace',
  description:
    'A personalized study workspace to map course topics, identify knowledge gaps, and plan your revision.',
  keywords: [
    'iGebra',
    'study planning',
    'diagnostic learning',
    'revision planning',
  ],
  authors: [{ name: 'iGebra' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased text-slate-100 selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
