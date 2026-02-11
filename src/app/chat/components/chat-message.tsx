'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: { seconds: number; nanoseconds: number };
}

interface ChatMessageProps {
    message: Message;
    isSender: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

function getRandomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function getRandomString(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += getRandomChar();
    }
    return result;
}

export default function ChatMessage({ message, isSender }: ChatMessageProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isDecrypting, setIsDecrypting] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isDecrypting && message.text) {
            let iteration = 0;
            const originalText = message.text;

            intervalRef.current = setInterval(() => {
                const newText = originalText
                    .split('')
                    .map((_char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return getRandomChar();
                    })
                    .join('');
                setDisplayedText(newText);

                if (iteration >= originalText.length) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setIsDecrypting(false);
                    setDisplayedText(originalText);
                }
                iteration += originalText.length / 45; // Control reveal speed based on length
            }, 30); // Controls frame rate
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isDecrypting, message.text]);
    
    // An initial scramble before the reveal effect starts
    useEffect(() => {
        if (message.text) {
           setDisplayedText(getRandomString(message.text.length));
        }
    }, [message.text]);

    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={cn(
                'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg',
                 isSender ? 'bg-primary/80 text-primary-foreground' : 'bg-card',
                 isDecrypting && 'glow-shadow-primary' // Add glow while decrypting
            )}>
                <p className="text-sm font-mono break-words">{displayedText}</p>
                 {!isDecrypting && message.timestamp && (
                    <p className="text-xs text-right mt-1 opacity-70">
                        {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                 )}
            </div>
        </div>
    );
}
