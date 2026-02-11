'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldAlert, ShieldCheck, ShieldOff, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const LogIcon = ({ status }: { status: string }) => {
  if (status === 'ALERT') return <ShieldAlert className="h-4 w-4 flex-shrink-0 text-red-500 text-glow-red" />;
  if (status === 'BLOCKED') return <ShieldOff className="h-4 w-4 flex-shrink-0 text-yellow-500 text-glow-yellow" />;
  if (status === 'NEUTRALIZED') return <ShieldCheck className="h-4 w-4 flex-shrink-0 text-green-500 text-glow-green" />;
  return null;
};

const Typewriter = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      setDisplayedText('');
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
          onComplete();
        }
      }, 50);
      return () => clearInterval(intervalId);
    }, [text, onComplete]);
  
    return <span>{displayedText}</span>;
};


export default function CyberGlobePage() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [logs, setLogs] = useState<{ id: number; status: string; message: string; color: string }[]>([]);
    const [attacks, setAttacks] = useState<{ id: number; from: string; to: string }[]>([]);
    const [currentIssueIndex, setCurrentIssueIndex] = useState(0);

    const locations = useMemo(() => ['USA', 'Russia', 'China', 'Germany', 'UK', 'N. Korea', 'Brazil', 'India', 'Japan', 'Iran'], []);
    const attackTypes = useMemo(() => ['Data Breach', 'DDoS', 'Ransomware', 'Phishing', 'Malware', 'Firewall'], []);
    const logStatuses = useMemo(() => [
        { status: 'ALERT', color: 'text-red-500' },
        { status: 'BLOCKED', color: 'text-yellow-500' },
        { status: 'NEUTRALIZED', color: 'text-green-500' }
    ], []);
    
    const countryCoords: { [key: string]: { x: number; y: number } } = useMemo(() => ({
        'USA': { x: 25, y: 40 }, 'Russia': { x: 65, y: 30 }, 'China': { x: 75, y: 45 },
        'Germany': { x: 52, y: 35 }, 'UK': { x: 48, y: 33 }, 'N. Korea': { x: 82, y: 40 },
        'Brazil': { x: 35, y: 65 }, 'India': { x: 70, y: 55 }, 'Japan': { x: 85, y: 42 },
        'Iran': { x: 62, y: 48 },
    }), []);

    const topIssues = useMemo(() => [
        "Data Theft Attempt", "Financial Ransomware Attack", "Government Server Breach", "Global Phishing Wave"
    ], []);

    // Matrix background effect
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

        const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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
        const intervalId = setInterval(draw, 40);
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', setCanvasSize);
        }
    }, []);

    // Fake data simulation
    useEffect(() => {
        const logInterval = setInterval(() => {
            const from = locations[Math.floor(Math.random() * locations.length)];
            let to = locations[Math.floor(Math.random() * locations.length)];
            while (from === to) to = locations[Math.floor(Math.random() * locations.length)];
            const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            const statusInfo = logStatuses[Math.floor(Math.random() * logStatuses.length)];
            const newLog = {
                id: Date.now(),
                status: statusInfo.status,
                message: `${from} -> ${to} : ${type}`,
                color: statusInfo.color
            };
            setLogs(prev => [newLog, ...prev.slice(0, 14)]);
        }, 2000);

        const attackInterval = setInterval(() => {
            const from = locations[Math.floor(Math.random() * locations.length)];
            let to = locations[Math.floor(Math.random() * locations.length)];
            while (from === to) to = locations[Math.floor(Math.random() * locations.length)];
            const newAttack = { id: Date.now(), from, to };
            setAttacks(prev => [...prev, newAttack]);
            setTimeout(() => setAttacks(prev => prev.filter(a => a.id !== newAttack.id)), 2000);
        }, 3000);

        return () => {
            clearInterval(logInterval);
            clearInterval(attackInterval);
        };
    }, [locations, attackTypes, logStatuses]);

    return (
        <div className="fixed inset-0 bg-black text-green-400 font-code overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20"></canvas>
            
            <div className="relative z-10 flex flex-col h-full w-full">
                {/* Header-like elements */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                    <h1 className="font-headline text-2xl md:text-3xl text-primary text-glow-primary">Baradari.web</h1>
                </div>
                 <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 z-20">
                    <Button variant="outline" className="bg-black/50" onClick={() => router.push('/chat')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Home
                    </Button>
                </div>

                {/* Mobile view: Globe fills screen */}
                <main className="md:hidden relative flex-1">
                    <Image 
                        src="https://images.unsplash.com/photo-1593369528447-c07925c3ba32?q=80&w=2000&auto=format&fit=crop"
                        alt="Digital World Map"
                        layout="fill"
                        objectFit="contain"
                        className="opacity-60"
                        data-ai-hint="digital world map"
                    />
                    <div className="absolute inset-0 radar-sweep-container">
                        <div className="radar-sweep-line"></div>
                    </div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {attacks.map(attack => {
                            const from = countryCoords[attack.from];
                            const to = countryCoords[attack.to];
                            const controlX = (from.x + to.x) / 2 + (from.y - to.y) / 4;
                            const controlY = (from.y + to.y) / 2 - (from.x - to.x) / 4;
                            return (
                                <path
                                    key={attack.id}
                                    d={`M${from.x},${from.y} Q${controlX},${controlY} ${to.x},${to.y}`}
                                    stroke="hsl(var(--destructive))"
                                    strokeWidth="0.3"
                                    fill="none"
                                    className="attack-line"
                                />
                            );
                        })}
                    </svg>
                    {/* Hotspots */}
                    <div className="absolute top-[35%] left-[52%]">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
                        </div>
                    </div>
                    <div className="absolute top-[40%] left-[25%]">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
                        </div>
                    </div>
                    <div className="absolute top-[45%] left-[75%]">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
                        </div>
                    </div>
                </main>

                {/* Desktop view: Grid layout */}
                <main className="hidden md:grid flex-1 grid-cols-12 grid-rows-6 gap-4 p-4 md:p-6 pt-16">
                    {/* Left Panel: Logs */}
                    <div className="col-span-3 row-span-6 glassmorphism-hacker p-4 overflow-hidden flex flex-col">
                        <h2 className="font-bold text-primary border-b border-primary/50 pb-2 mb-2">ATTACK LOGS</h2>
                        <ul className="space-y-2 text-xs overflow-y-auto h-full pr-2 flex-1">
                           {logs.map(log => (
                               <li key={log.id} className="flex items-start gap-2 animate-fade-in">
                                   <LogIcon status={log.status} />
                                   <span className={cn('font-bold', log.color)}>[{log.status}]</span>
                                   <span className="text-muted-foreground">{log.message}</span>
                               </li>
                           ))}
                        </ul>
                    </div>

                    {/* Center: Globe */}
                    <div className="relative col-span-6 row-span-4 overflow-hidden">
                         <Image 
                            src="https://images.unsplash.com/photo-1593369528447-c07925c3ba32?q=80&w=2000&auto=format&fit=crop"
                            alt="Digital World Map"
                            fill
                            className="object-contain opacity-60"
                            data-ai-hint="digital world map"
                         />
                         <div className="absolute inset-0 radar-sweep-container">
                            <div className="radar-sweep-line"></div>
                         </div>
                         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {attacks.map(attack => {
                                const from = countryCoords[attack.from];
                                const to = countryCoords[attack.to];
                                const controlX = (from.x + to.x) / 2 + (from.y - to.y) / 4;
                                const controlY = (from.y + to.y) / 2 - (from.x - to.x) / 4;
                                return (
                                    <path
                                        key={attack.id}
                                        d={`M${from.x},${from.y} Q${controlX},${controlY} ${to.x},${to.y}`}
                                        stroke="hsl(var(--destructive))"
                                        strokeWidth="0.3"
                                        fill="none"
                                        className="attack-line"
                                    />
                                );
                            })}
                         </svg>
                         {/* Hotspots */}
                         <div className="absolute top-[35%] left-[52%]">
                            <div className="relative flex h-2 w-2">
                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                                <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
                            </div>
                         </div>
                         <div className="absolute top-[40%] left-[25%]">
                             <div className="relative flex h-2 w-2">
                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                                <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
                            </div>
                         </div>
                          <div className="absolute top-[45%] left-[75%]">
                             <div className="relative flex h-2 w-2">
                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                                <div className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></div>
                            </div>
                         </div>
                    </div>

                    {/* Top Right: Issues */}
                    <div className="col-span-3 row-span-2 glassmorphism-hacker p-4">
                        <h2 className="font-bold text-primary border-b border-primary/50 pb-2 mb-2">TOP CYBER ISSUES</h2>
                        <ul className="space-y-3 text-sm">
                            {topIssues.map((issue, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className={cn("h-2 w-2 rounded-full", currentIssueIndex > index ? 'bg-green-500' : 'bg-red-500 animate-pulse')}/>
                                    {currentIssueIndex === index && <Typewriter text={issue} onComplete={() => setCurrentIssueIndex(i => i + 1)} />}
                                    {currentIssueIndex > index && <span>{issue}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bottom Right: Status */}
                     <div className="col-span-3 row-span-4 glassmorphism-hacker p-4 flex flex-col justify-between">
                        <div>
                            <h2 className="font-bold text-primary border-b border-primary/50 pb-2 mb-2">SYSTEM STATUS</h2>
                            <p className="text-green-400 text-glow-green text-lg font-bold">ALL SYSTEMS NOMINAL</p>
                            <p className="text-xs text-muted-foreground">Network Integrity: 99.98%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-yellow-400">Threat Neutralized</p>
                            <p className="text-xs text-muted-foreground">Recovery Protocol Activated</p>
                        </div>
                    </div>
                </main>
                
                {/* Footer */}
                <footer className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center p-2 bg-black/50 text-xs text-muted-foreground rounded-md z-20">
                    Simulation Interface – For Visual Experience Only
                </footer>
            </div>
        </div>
    );
}

    