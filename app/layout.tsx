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
  title: 'SEGERA | Sistem Evaluasi Geografi & Aksesibiliti 10-Minit Malaysia',
  description: 'Malaysia-First 10-Minute City Engine. Analisa perumahan berpandukan surau, status halal, risiko banjir kilat, dan jarak 10 minit motosikal sebenar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ms"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#FFFBF5] text-[#1A1A1A] font-sans selection:bg-[#1B7A3D]/20 selection:text-[#1A1A1A]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
