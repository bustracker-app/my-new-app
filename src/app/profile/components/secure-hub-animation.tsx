'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Typewriter = ({
  line,
  onComplete,
  speed = 50,
}: {
  line: string;
  onComplete?: () => void;
  speed?: number;
}) => {
  const [text, setText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + line[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 300); // Pause after typing
      return () => clearTimeout(timeout);
    }
  }, [charIndex, line, onComplete, speed]);

  return (
    <div className="whitespace-pre-wrap">
      {text}
      <span className="inline-block animate-pulse">_</span>
    </div>
  );
};


export default function SecureHubAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'typing' | 'progress' | 'finished'>('typing');
  const typingLine = 'Initializing secure connection...';

  useEffect(() => {
    if (stage === 'progress') {
      const timer = setTimeout(() => {
        setStage('finished');
      }, 1000); // Progress bar duration
      return () => clearTimeout(timer);
    } else if (stage === 'finished') {
      const timer = setTimeout(() => {
        onComplete();
      }, 500); // Fade out duration
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F1F] font-code text-green-400 transition-opacity duration-500',
        stage === 'finished' ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="w-full max-w-lg p-4">
        <div className="rounded-lg border border-primary/20 bg-black/30 p-6 shadow-[0_0_20px_hsl(var(--primary)_/_0.2)]">
          {stage === 'typing' && (
            <Typewriter
              line={typingLine}
              onComplete={() => setStage('progress')}
            />
          )}

          {(stage === 'progress' || stage === 'finished') && (
            <div className="space-y-3">
              <p className="text-green-400">Secure Mode Activated</p>
              <div className="h-1 w-full overflow-hidden rounded-full bg-primary/20">
                <div className="h-full animate-fill-progress rounded-full bg-green-400"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
