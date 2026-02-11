'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppLockAnimation({ onComplete }: { onComplete: () => void }) {
  const [scanline, setScanline] = useState(false);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    // Start scanline animation
    const scanlineTimer = setTimeout(() => {
      setScanline(true);
    }, 100);

    // Show "Access Granted" after scanline
    const grantedTimer = setTimeout(() => {
      setGranted(true);
    }, 1000);

    // Trigger completion after the animation duration
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000); // Total animation duration

    return () => {
      clearTimeout(scanlineTimer);
      clearTimeout(grantedTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background font-code text-primary overflow-hidden">
      {/* Audio will play automatically on component mount */}
      <audio autoPlay>
        {/* The user needs to place their audio file at /public/audio/access-granted.mp3 */}
        <source src="/audio/access-granted.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="relative flex flex-col items-center justify-center w-48 h-48">
        <ShieldCheck
          className={cn(
            'h-24 w-24 text-primary/30 transition-all duration-1000',
            granted && 'text-primary text-glow-primary scale-110'
          )}
        />
        {/* Scanline Effect */}
        <div
          className={cn(
            'absolute top-0 left-0 w-full h-1 bg-primary/70 shadow-[0_0_10px_theme(colors.primary)] transition-transform duration-1000 ease-in-out',
            scanline ? 'translate-y-[12rem]' : '-translate-y-12', // h-48 is 12rem
            granted && 'opacity-0'
          )}
        />
      </div>

      <h1
        className={cn(
          'absolute bottom-1/4 text-2xl font-bold uppercase tracking-widest text-glow-primary transition-opacity duration-500',
          granted ? 'opacity-100 animate-fade-in' : 'opacity-0'
        )}
      >
        Access Granted
      </h1>
    </div>
  );
}
