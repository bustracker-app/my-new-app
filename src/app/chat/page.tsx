'use client';

import { useState } from 'react';
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';
import ChatList from './components/chat-list';
import UserList from './components/user-list';
import ChatWindow from './components/chat-window';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{ id: string; otherParticipantId: string } | null>(null);
  const auth = useAuth();
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile } = useDoc(userDocRef);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: 'Logout Successful',
        description: 'You have been securely logged out.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'Could not log you out.',
      });
    }
  };

  const handleSelectChat = (chatId: string, otherParticipantId: string) => {
    setSelectedChat({ id: chatId, otherParticipantId });
  };

  return (
    <div className="flex h-screen w-full font-code text-foreground glassmorphism">
      <div className="flex w-full max-w-xs flex-col border-r border-primary/20">
        <div className="flex items-center justify-between border-b border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userProfile?.profilePhoto} />
              <AvatarFallback>
                {userProfile?.username?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold">{userProfile?.username}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <UserList onChatCreated={handleSelectChat} />
          <Separator className="my-2 bg-primary/20" />
          <ChatList
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChat?.id}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {selectedChat ? (
          <ChatWindow
            key={selectedChat.id}
            chatId={selectedChat.id}
            otherParticipantId={selectedChat.otherParticipantId}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="font-headline text-2xl text-primary">
                Welcome to Baradari.web
              </h2>
              <p className="text-muted-foreground">
                Select a contact to start a secure transmission.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
