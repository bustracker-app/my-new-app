'use client';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2 } from "lucide-react";
import MessageInput from "./message-input";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

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

    if (isLoadingUser || !currentUser) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4"/>
                    <p className="text-muted-foreground">Initializing Secure Connection...</p>
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
                        <div key={message.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${isSender ? 'bg-primary/80 text-primary-foreground' : 'bg-card'}`}>
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-right mt-1 opacity-70">
                                    {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
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
