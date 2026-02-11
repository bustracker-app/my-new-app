'use client';
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type Chat = {
    id: string;
    participants: string[];
    lastMessage: string;
    lastMessageTime: { seconds: number; nanoseconds: number };
}

type UserProfile = {
    uid: string;
    username: string;
    email: string;
    profilePhoto: string;
    status: 'online' | 'offline';
};

interface ChatListProps {
  onSelectChat: (chatId: string, otherParticipantId: string) => void;
  selectedChatId?: string | null;
}

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
    const firestore = useFirestore();
    const { user: currentUser } = useUser();
    
    const chatsQuery = useMemoFirebase(() => {
        if (!firestore || !currentUser) return null;
        return query(
            collection(firestore, "chats"), 
            where("participants", "array-contains", currentUser.uid)
        );
    }, [firestore, currentUser]);
    
    const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);
    
    const usersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);

    const usersMap = useMemo(() => {
        if (!users) return new Map<string, UserProfile>();
        return new Map(users.map(user => [user.uid, user]));
    }, [users]);

    // Manually sort chats by lastMessageTime on the client-side
    const sortedChats = useMemo(() => {
        if (!chats) return [];
        return [...chats].sort((a, b) => {
            const timeA = a.lastMessageTime?.seconds || 0;
            const timeB = b.lastMessageTime?.seconds || 0;
            return timeB - timeA;
        });
    }, [chats]);

    if (isLoadingChats || isLoadingUsers) {
        return (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin"/>
            </div>
        )
    }

    return (
        <div className="p-2 space-y-1">
            <h2 className="p-2 text-xs font-bold uppercase text-muted-foreground">Messages</h2>
            {sortedChats?.map((chat) => {
                const otherParticipantId = chat.participants.find(p => p !== currentUser?.uid);
                if (!otherParticipantId) return null;
                
                const otherParticipant = usersMap.get(otherParticipantId);
                if (!otherParticipant) return null;

                return (
                    <button
                        key={chat.id}
                        className={cn(
                            "w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 transition-colors",
                            selectedChatId === chat.id && "bg-primary/20"
                        )}
                        onClick={() => onSelectChat(chat.id, otherParticipant.uid)}
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={otherParticipant.profilePhoto} alt={otherParticipant.username} />
                            <AvatarFallback>{otherParticipant.username?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 truncate">
                            <p className="font-semibold">{otherParticipant.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{chat.lastMessage || "..."}</p>
                        </div>
                    </button>
                )
            })}
        </div>
    );
}
