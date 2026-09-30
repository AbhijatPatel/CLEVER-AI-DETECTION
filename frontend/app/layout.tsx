import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Clever AI | AI Content Intelligence & Digital Forensics Platform',
  description: 'Understand the authenticity of digital content. Analyze text, documents, images, audio, and video using explainable AI and digital forensics signals.',
  keywords: ['AI detection', 'digital forensics', 'deepfake analysis', 'content intelligence', 'explainable AI', 'provenance'],
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
