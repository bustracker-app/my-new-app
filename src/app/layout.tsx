import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Source+Code+Pro:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
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
