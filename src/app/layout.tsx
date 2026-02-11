import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { orbitron, sourceCodePro } from '@/app/fonts';

export const metadata: Metadata = {
  title: 'Baradari.web',
  description: 'Futuristic, encrypted, broadcast-based web chat.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${orbitron.variable} ${sourceCodePro.variable}`}
    >
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-code antialiased',
          'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,255,255,0.3),rgba(255,255,255,0))]'
        )}
      >
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
