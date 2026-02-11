'use client';

import { useEffect, useState, useMemo } from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const hackingCode = `
import { secure } from 'baradari-net';

async function enhanceSecurity(userId) {
  const user = await db.users.get(userId);
  console.log('[INFO] User found:', user.username);
  console.log('[INIT] Applying Quantum-Resistant Encryption...');
  
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  user.security.setEncryptionKey(key);
  
  console.log('[OK] Encryption key established.');
  console.log('[INIT] Hardening firewall protocols...');
  firewall.addRule('DENY ALL INGRESS_FROM *');
  firewall.addRule('ALLOW EGRESS_TO baradari-net:*');
  console.log('[OK] Firewall hardened.');

  await user.save();
  console.log('[SUCCESS] Profile Secured.');
  return true;
}

enhanceSecurity('user-profile-stream');
`;

const Typewriter = ({ text, onComplete, speed = 20 }: { text: string; onComplete?: () => void; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayedText((prev) => prev + text[i]);
            i++;
            if (i >= text.length) {
                clearInterval(intervalId);
                onComplete?.();
            }
        }, speed);
        return () => clearInterval(intervalId);
    }, [text, onComplete, speed]);

    return <span>{displayedText}</span>;
};

export default function SecureHubAnimation({ onComplete }: { onComplete: () => void }) {
    const [stage, setStage] = useState(0);

    const stages = useMemo(() => [
        "INITIALIZING SECURE HUB...",
        "PUSHING ACCESS REQUEST...",
        "ACCESS GRANTED. KERNEL-LEVEL ACCESS ACQUIRED.",
        "ENCRYPTING DATA STREAMS...",
        hackingCode,
        "SECURING PROFILE...",
        "SECURED SUCCESSFULLY",
        "RE-ENTERING APPLICATION...",
        "ACCESS GRANTED"
    ], []);

    useEffect(() => {
        if (stage < stages.length - 3) { // For all stages before the final ones
             const delay = stage === 4 ? 2000 : 1000;
             const timer = setTimeout(() => setStage(s => s + 1), delay);
             return () => clearTimeout(timer);
        } else if (stage === stages.length - 3) { // "Secured Successfully"
            const timer = setTimeout(() => setStage(s => s + 1), 2000);
            return () => clearTimeout(timer);
        } else if (stage === stages.length - 2) { // "Re-entering"
            const timer = setTimeout(() => setStage(s => s + 1), 1500);
            return () => clearTimeout(timer);
        } else if (stage === stages.length - 1) { // Final "Access Granted"
            const timer = setTimeout(onComplete, 2000);
            return () => clearTimeout(timer);
        }
    }, [stage, stages.length, onComplete]);


    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-code text-green-400 p-4">
            <div className="w-full max-w-4xl h-full border-2 border-green-500/50 bg-black/50 p-4 overflow-y-auto glow-shadow-primary">
                {stages.map((content, index) => {
                    if (index > stage) return null;
                    
                    if (index === 4) { // The hacking code block
                        return (
                            <div key={index} className="whitespace-pre-wrap text-xs">
                                <span className="text-green-500/80">$ </span>
                                <Typewriter text={content} speed={5} />
                            </div>
                        )
                    }

                    if (index === 6) { // Secured successfully
                        return (
                             <div key={index} className="flex items-center gap-2 text-xl mt-4">
                                <CheckCircle className="h-6 w-6 text-green-400"/>
                                <span>{content}</span>
                            </div>
                        )
                    }
                    
                    return (
                        <div key={index} className={cn("flex items-center gap-2", index > 0 && "mt-2")}>
                           <span className="text-green-500/80">&gt;</span>
                           <span><Typewriter text={content} /></span>
                        </div>
                    )
                })}
            </div>
             {stage >= stages.length - 2 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black animate-fade-in">
                    <div className="text-center">
                        <ShieldCheck className="h-16 w-16 mx-auto text-primary animate-pulse" />
                        <h2 className="font-headline text-3xl mt-4 text-primary text-glow-primary">
                            {stages[stage]}
                        </h2>
                    </div>
                </div>
            )}
        </div>
    )
}
