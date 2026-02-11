'use client';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import MessageInput from "./message-input";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./chat-message";

type UserProfile = {
    uid: string;
    username: string;
    email: string;
    profilePhoto: string;
    status: 'online' | 'offline';
};

type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: { seconds: number; nanoseconds: number };
}

interface ChatWindowProps {
  chatId: string;
  otherParticipantId: string;
  onBack: () => void;
}

export default function ChatWindow({ chatId, otherParticipantId, onBack }: ChatWindowProps) {
    const firestore = useFirestore();
    const { user: currentUser } = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isConnecting, setIsConnecting] = useState(true);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !otherParticipantId) return null;
        return doc(firestore, 'users', otherParticipantId);
    }, [firestore, otherParticipantId]);
    const { data: otherUser, isLoading: isLoadingUser } = useDoc<UserProfile>(userDocRef);

    const messagesQuery = useMemoFirebase(() => {
        if (!firestore || !chatId) return null;
        return query(collection(firestore, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));
    }, [firestore, chatId]);
    const { data: messages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      setIsConnecting(true);
      const timer = setTimeout(() => {
        setIsConnecting(false);
      }, 1500);
      return () => clearTimeout(timer);
    }, [chatId]);

    if (isLoadingUser || !currentUser || isConnecting) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center flex flex-col items-center gap-4">
                    <ShieldCheck className="h-10 w-10 text-primary animate-pulse" />
                    <p className="text-muted-foreground font-mono">Establishing Secure Channel...</p>
                    <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                </div>
            </div>
        );
    }
    
    if (!otherUser) {
        return (
             <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Could not load user data.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-screen">
            <header className="p-4 flex items-center gap-4 border-b border-primary/20">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                    <ArrowLeft className="h-6 w-6"/>
                </Button>
                <Avatar>
                    <AvatarImage src={otherUser.profilePhoto} />
                    <AvatarFallback>{otherUser.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-bold text-lg">{otherUser.username}</h2>
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${otherUser.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        <p className="text-xs text-muted-foreground">{otherUser.status}</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages && <Loader2 className="h-6 w-6 animate-spin mx-auto"/>}
                {messages?.map(message => {
                    const isSender = message.senderId === currentUser.uid;
                    return (
                        <ChatMessage key={message.id} message={message} isSender={isSender} />
                    )
                })}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t border-primary/20">
                <MessageInput chatId={chatId} senderId={currentUser.uid} />
            </footer>
        </div>
    );
}
