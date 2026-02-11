'use client';
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOrCreateChat } from "@/lib/actions";
import { Loader2 } from "lucide-react";

type UserProfile = {
    uid: string;
    username: string;
    email: string;
    profilePhoto: string;
    status: 'online' | 'offline';
};

interface UserListProps {
  onChatCreated: (chatId: string, otherParticipantId: string) => void;
}

export default function UserList({ onChatCreated }: UserListProps) {
    const firestore = useFirestore();
    const { user: currentUser } = useUser();
    
    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !currentUser) return null;
        return query(collection(firestore, "users"), where("uid", "!=", currentUser.uid));
    }, [firestore, currentUser]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

    const handleUserClick = async (otherUser: UserProfile) => {
        if (!currentUser || !firestore) return;
        const chatId = await getOrCreateChat(firestore, currentUser.uid, otherUser.uid);
        onChatCreated(chatId, otherUser.uid);
    };

    if (isLoading) {
        return (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin"/>
            </div>
        )
    }

    return (
        <div className="p-2 space-y-1">
             <h2 className="p-2 text-xs font-bold uppercase text-muted-foreground">Contacts</h2>
            {users?.map((user) => (
                <button
                    key={user.uid}
                    className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 transition-colors"
                    onClick={() => handleUserClick(user)}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePhoto} alt={user.username} />
                        <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.status}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
