'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function SecureHubAnimation({ onComplete }: { onComplete: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Total animation time is 3 seconds.
    // We'll start fading out a little before the end for a smoother transition.
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500); // Start fade-out at 2.5s

    // The onComplete callback is triggered after the full 3 seconds.
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000); // Total duration

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm font-code text-green-400 transition-opacity duration-500',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="w-full max-w-lg p-4">
        <div className="rounded-lg border border-primary/20 bg-black/50 p-6 shadow-[0_0_20px_hsl(var(--primary)_/_0.2)]">
            <div className="space-y-3">
              <p className="text-green-400">Enabling Secure Hub...</p>
              <div className="h-1 w-full overflow-hidden rounded-full bg-primary/20">
                <div 
                    className="h-full rounded-full bg-green-400"
                    style={{ animation: 'fill-progress 2.5s ease-out forwards' }}
                ></div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
