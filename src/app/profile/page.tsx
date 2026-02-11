'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Mail, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type UserProfile = {
    uid: string;
    username: string;
    email: string;
    profilePhoto: string;
    bio: string;
    status: 'online' | 'offline';
};

export default function ProfilePage() {
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-foreground">Loading Profile...</p>
      </div>
    );
  }
  
  if (!userProfile) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <p className="text-destructive">Could not load user profile.</p>
            <Button onClick={() => router.push('/chat')}>Back to Chat</Button>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 font-code">
      <Card className="w-full max-w-md glassmorphism">
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle className="font-headline text-2xl text-primary">User Profile</CardTitle>
             <Button variant="ghost" size="icon" onClick={() => router.push('/chat')}>
                <ArrowLeft className="h-5 w-5" />
             </Button>
          </div>
          <CardDescription>Your secure identity within the Baradari network.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pt-6">
            <Avatar className="h-24 w-24 border-2 border-primary/50">
                <AvatarImage src={userProfile.profilePhoto} alt={userProfile.username} />
                <AvatarFallback className="text-3xl">{userProfile.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="w-full space-y-4 text-center">
                <div>
                    <h2 className="text-2xl font-bold font-headline">{userProfile.username}</h2>
                    <p className="text-sm text-muted-foreground">{userProfile.status === 'online' ? 'Online' : 'Offline'}</p>
                </div>
                
                <Separator className="bg-primary/20" />

                <div className="space-y-3 text-left px-2">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-sm">{userProfile.email}</span>
                    </div>
                     <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground break-words">{userProfile.bio}</p>
                    </div>
                </div>

            </div>

             <Button className="w-full font-headline glow-shadow-primary" disabled>Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
