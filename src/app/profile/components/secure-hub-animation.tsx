'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Fingerprint, ScanFace, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Typewriter = ({ text, onComplete, speed = 50 }: { text: string; onComplete?: () => void; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        if (text.length === 0) {
            onComplete?.();
            return;
        }
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(intervalId);
                onComplete?.();
            }
        }, speed);
        return () => clearInterval(intervalId);
    }, [text, onComplete, speed]);

    return <span dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

const hackingCode = `
[INFO] Bypassing standard security layers...
[INIT] Engaging Quantum-Resistant Encryption Matrix...
[AUTH] User Identity Verified: UID-4B2A-9C7E
[CMD] command.execute(new QuantumFirewall());
[LOG] Firewall rule added: DENY ALL INGRESS FROM threat_net:*
[LOG] Establishing secure tunnel via endpoint...
[OK] Tunnel established. Data stream integrity: 100%
[CMD] command.execute(new SecurityProtocol('v7.2.1'));
[LOG] Protocol v7.2.1 installed.
[SYS] System secured. Locking parameters...
[SUCCESS] Secure Mode Activated.
`;

export default function SecureHubAnimation({ onComplete }: { onComplete: () => void }) {
    const [stage, setStage] = useState(0); // 0: Glitch, 1: Scans, 2: Terminal, 3: Progress, 4: Granted, 5: Redirect
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [typedCode, setTypedCode] = useState('');

    const textSequence = useMemo(() => [
        "Initializing Quantum Firewall",
        "Establishing Secure Tunnel",
        "Installing Security Protocol"
    ], []);

    useEffect(() => {
        // Stage manager
        const timers: NodeJS.Timeout[] = [];
        switch(stage) {
            case 0: // Glitch
                timers.push(setTimeout(() => setStage(1), 500));
                break;
            case 1: // Scans
                timers.push(setTimeout(() => setStage(2), 4000));
                break;
            case 2: // Terminal
                // Wait for typewriter to finish
                break;
            case 3: // Progress
                const progressInterval = setInterval(() => {
                    setProgress(p => {
                        if (p >= 100) {
                            clearInterval(progressInterval);
                            timers.push(setTimeout(() => setStage(4), 1000));
                            return 100;
                        }
                        return p + 1;
                    });
                }, 40);
                timers.push(progressInterval as unknown as NodeJS.Timeout);
                break;
            case 4: // Granted
                timers.push(setTimeout(() => setStage(5), 3000));
                break;
            case 5: // Redirect
                timers.push(setTimeout(onComplete, 2000));
                break;
        }
        return () => timers.forEach(clearTimeout);
    }, [stage, onComplete]);
    
    // Matrix rain effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const alphabet = '01';
        const fontSize = 16;
        const columns = Math.ceil(canvas.width / fontSize);
        const rainDrops: number[] = Array(columns).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'hsl(var(--primary))';
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };
        const intervalId = setInterval(draw, 50);
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', setCanvasSize);
        }
    }, []);

    return (
        <div className={cn("fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-code text-green-400 p-4", stage === 0 && 'animate-glitch-fast')}>
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-10"></canvas>
            <Image 
                src="https://images.unsplash.com/photo-1593369528447-c07925c3ba32?q=80&w=2000&auto=format&fit=crop"
                alt="Digital World Map"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-10"
                data-ai-hint="digital world map"
            />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                
                {/* Stage 1: Scans */}
                {stage === 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 animate-fade-in">
                        <div className="flex flex-col items-center gap-4">
                            <Fingerprint className="h-24 w-24 text-primary animate-pulse" />
                            <p className="font-headline text-lg text-primary text-glow-primary">VERIFYING BIOMETRICS</p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <ScanFace className="h-24 w-24 text-primary animate-pulse" />
                            <p className="font-headline text-lg text-primary text-glow-primary">ANALYSING FACIAL SCAN</p>
                        </div>
                    </div>
                )}

                {/* Stage 2: Hacking Terminal */}
                {stage === 2 && (
                    <div className="w-full max-w-4xl h-3/4 glassmorphism-hacker p-4 overflow-y-auto text-xs md:text-sm">
                        <span className="text-green-500/80">$ </span>
                        <Typewriter text={hackingCode.replace(/\n/g, '<br/>')} speed={10} onComplete={() => setStage(3)} />
                    </div>
                )}
                
                {/* Stage 3: Progress Bar & Text */}
                {stage === 3 && (
                    <div className="w-full max-w-2xl flex flex-col items-center gap-6 animate-fade-in">
                        <h2 className="font-headline text-2xl text-primary text-glow-primary animate-text-flicker">
                            {progress < 33 ? textSequence[0] : progress < 66 ? textSequence[1] : textSequence[2]}...
                        </h2>
                        <div className="w-full h-4 bg-primary/20 border border-primary/50 rounded-full overflow-hidden">
                            <div className="h-full bg-primary glow-shadow-primary" style={{width: `${progress}%`}}></div>
                        </div>
                        <p className="text-4xl font-bold">{progress}%</p>
                    </div>
                )}

                {/* Stage 4 & 5: Access Granted & Redirect */}
                {(stage === 4 || stage === 5) && (
                     <div className="text-center animate-fade-in">
                        <ShieldCheck className="h-32 w-32 mx-auto text-primary animate-shield-particles text-glow-primary" />
                        <h2 className="font-headline text-5xl mt-4 text-primary text-glow-primary animate-text-flicker">
                            ACCESS GRANTED
                        </h2>
                         {stage === 5 && (
                            <p className="mt-4 text-lg text-muted-foreground">Redirecting to Secure Hub...</p>
                         )}
                    </div>
                )}
            </div>
        </div>
    )
}
