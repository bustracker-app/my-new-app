'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// A component to display text with a typewriter effect
const Typewriter = ({
  lines,
  onComplete,
  speed = 40,
}: {
  lines: string[];
  onComplete?: () => void;
  speed?: number;
}) => {
  const [text, setText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) {
      onComplete?.();
      return;
    }

    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + currentLine[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText((prev) => prev + '\n');
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 300); // Pause before next line
      return () => clearTimeout(timeout);
    }
  }, [lineIndex, charIndex, lines, onComplete, speed]);

  return (
    <div className="whitespace-pre-wrap">
      {text}
      <span className="inline-block animate-pulse">_</span>
    </div>
  );
};

export default function SecureHubAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'typing' | 'progress' | 'finished'>('typing');

  const typingLines = [
    'Initializing secure hub...',
    'Verifying encrypted key...',
    'Authenticating user identity...',
    'Establishing secure connection...',
    'Loading security layer...',
    'Access granted.',
  ];

  useEffect(() => {
    if (stage === 'progress') {
      // Duration for the progress bar animation
      const timer = setTimeout(() => {
        setStage('finished');
      }, 1500);
      return () => clearTimeout(timer);
    } else if (stage === 'finished') {
      // Duration for the final fade-out before completing
      const timer = setTimeout(() => {
        onComplete();
      }, 750);
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
              lines={typingLines}
              onComplete={() => setStage('progress')}
            />
          )}

          {(stage === 'progress' || stage === 'finished') && (
            <div className="space-y-3">
              <p className="text-green-400">Secure Mode Activated</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to Application...
              </p>
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
