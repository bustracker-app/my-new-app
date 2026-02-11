'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function UpdateSettingsAnimation({ onComplete }: { onComplete: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Timer to switch from progress bar to "complete" text
    const completeTextTimer = setTimeout(() => {
        setIsComplete(true);
    }, 2000); // Show complete text after 2s

    // Timer to start fading out the whole component
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500); // Start fade-out at 2.5s

    // Timer to call the onComplete callback after the animation is finished
    const onCompleteTimer = setTimeout(() => {
      onComplete();
    }, 3000); // Total duration is 3 seconds

    return () => {
      clearTimeout(completeTextTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(onCompleteTimer);
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
            {!isComplete ? (
              <div className="space-y-3">
                <p className="text-green-400">Saving changes...</p>
                <div className="h-1 w-full overflow-hidden rounded-full bg-primary/20">
                  <div 
                      className="h-full rounded-full bg-green-400"
                      style={{ animation: 'fill-progress 2s ease-out forwards' }}
                  ></div>
                </div>
              </div>
            ) : (
                <div className="flex flex-col items-center text-center gap-2 animate-fade-in text-glow-green">
                    <p className="text-lg font-bold">✔ Changes Saved</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
