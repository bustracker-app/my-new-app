'use client';

import { useState, useEffect } from 'react';
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, Home, User } from 'lucide-react';
import ChatList from './components/chat-list';
import UserList from './components/user-list';
import ChatWindow from './components/chat-window';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{ id: string; otherParticipantId: string } | null>(null);
  const [hackyText, setHackyText] = useState('');
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

  useEffect(() => {
    const chars = '█▓▒░-';
    const interval = setInterval(() => {
        let text = 'INCOMING_STREAM::';
        for (let i = 0; i < 20; i++) {
            text += chars[Math.floor(Math.random() * chars.length)];
        }
        setHackyText(text);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      if (!auth) return;
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
      <div className={cn(
        "flex w-full flex-col border-r border-primary/20 md:w-full md:max-w-xs md:flex",
        selectedChat ? "hidden" : "flex"
      )}>
        <div className="border-b border-primary/20 p-4">
          <div className="text-center">
            <h1 className="font-headline text-2xl font-bold text-primary">
              BARADARI
            </h1>
            <p className="text-xs text-muted-foreground">(BOI KYA WANAN)</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
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
        </div>

        <div className="flex-1 overflow-y-auto">
          <UserList onChatCreated={handleSelectChat} />
          <Separator className="my-2 bg-primary/20" />
          <ChatList
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChat?.id}
          />
        </div>

        <footer className="mt-auto border-t border-primary/20 p-2">
            <div className="flex items-center justify-around">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary/80 hover:bg-primary/10 hover:text-primary">
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Home</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary/80 hover:bg-primary/10 hover:text-primary">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                </Button>
            </div>
            <div className="mt-1 text-center text-xs font-mono text-primary/60 overflow-hidden whitespace-nowrap" title={hackyText}>
                {hackyText}
            </div>
        </footer>
      </div>

      <div className={cn(
        "flex flex-1 flex-col",
        selectedChat ? "flex" : "hidden md:flex"
      )}>
        {selectedChat ? (
          <ChatWindow
            key={selectedChat.id}
            chatId={selectedChat.id}
            otherParticipantId={selectedChat.otherParticipantId}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold text-primary">
                BARADARI
              </h2>
              <p className="text-sm text-muted-foreground">(BOI KYA WANAN)</p>
              <p className="mt-2 text-muted-foreground">
                Select a contact to start a secure transmission.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
