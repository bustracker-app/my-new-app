'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Typewriter = ({
  line,
  onComplete,
  speed = 40,
}: {
  line: string;
  onComplete?: () => void;
  speed?: number;
}) => {
  const [text, setText] = useState('');
  
  useEffect(() => {
    setText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setText((prev) => prev + line[i]);
      i++;
      if (i >= line.length) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(intervalId);
  }, [line, onComplete, speed]);

  return (
    <div className="whitespace-pre-wrap">
      {text}
      <span className="inline-block animate-pulse">_</span>
    </div>
  );
};


export default function UpdateSettingsAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const lines = [
    'Updating secure credentials...',
    'Encrypting new identity key...',
    'Syncing database records...',
    'Validating security protocols...',
    'Applying changes...',
    'Saving changes...'
  ];

  useEffect(() => {
    if (stage === lines.length) {
      const timer = setTimeout(() => setStage(prev => prev + 1), 500); // Wait after typing for progress
      return () => clearTimeout(timer);
    }
  }, [stage, lines.length]);

  useEffect(() => {
    if(stage === lines.length + 2) { // Final stage
        const timer = setTimeout(() => {
            onComplete();
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [stage, onComplete, lines.length]);


  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm font-code text-green-400 transition-opacity duration-500',
        stage === lines.length + 2 ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="w-full max-w-lg p-4">
        <div className="rounded-lg border border-primary/20 bg-black/50 p-6 shadow-[0_0_20px_hsl(var(--primary)_/_0.2)]">
            {stage < lines.length && (
                <Typewriter
                    line={lines[stage]}
                    onComplete={() => setStage(prev => prev + 1)}
                />
            )}
            
            {stage === lines.length && (
                <div className="space-y-3">
                    <p className="text-green-400">Saving changes...</p>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-primary/20">
                        <div className="h-full animate-fill-progress rounded-full bg-green-400" onAnimationEnd={() => setStage(prev => prev + 1)}></div>
                    </div>
                </div>
            )}

            {stage > lines.length && (
                 <div className="flex flex-col items-center text-center gap-2 animate-fade-in text-glow-green">
                    <p className="text-lg font-bold">✔ Changes Saved Successfully</p>
                    <p className="text-sm">Security Protocol Updated</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
