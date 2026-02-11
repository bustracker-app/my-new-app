'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase, useFirebaseApp } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Mail, FileText, Camera, Save, X, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import SecureHubAnimation from './components/secure-hub-animation';

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
  const firebaseApp = useFirebaseApp();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecureHub, setShowSecureHub] = useState(false);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username);
      setBio(userProfile.bio);
    }
  }, [userProfile]);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelEdit = () => {
    if (userProfile) {
      setUsername(userProfile.username);
      setBio(userProfile.bio);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
     if (!authUser || !firestore || !firebaseApp) return;
    setIsSaving(true);
    
    try {
        let newAvatarUrl = userProfile?.profilePhoto || '';

        if (avatarFile) {
            const storage = getStorage(firebaseApp);
            const avatarRef = storageRef(storage, `profile-pictures/${authUser.uid}`);
            await uploadBytes(avatarRef, avatarFile);
            newAvatarUrl = await getDownloadURL(avatarRef);
        }

        const userRef = doc(firestore, 'users', authUser.uid);
        await updateDoc(userRef, {
            username: username,
            bio: bio,
            profilePhoto: newAvatarUrl,
        });

        toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
    } catch (error: any) {
        toast({ variant: "destructive", title: "Update Failed", description: error.message || "Could not save your profile." });
    } finally {
        setIsSaving(false);
    }
  };

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

  if (showSecureHub) {
    return <SecureHubAnimation onComplete={() => setShowSecureHub(false)} />
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
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary/50">
                  <AvatarImage src={avatarPreview || userProfile.profilePhoto} alt={userProfile.username} />
                  <AvatarFallback className="text-3xl">{userProfile.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <button 
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                  <Camera className="h-4 w-4" />
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            
            <div className="w-full space-y-4 text-center">
              {isEditing ? (
                  <div className="space-y-4 px-2 text-left">
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="text-center font-headline text-2xl" />
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Your bio..." className="min-h-[80px] text-sm text-muted-foreground" />
                  </div>
              ) : (
                <div>
                    <h2 className="text-2xl font-bold font-headline">{userProfile.username}</h2>
                    <p className="text-sm text-muted-foreground">{userProfile.status === 'online' ? 'Online' : 'Offline'}</p>
                </div>
              )}
                
              <Separator className="bg-primary/20" />

              <div className="space-y-3 text-left px-2">
                  <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-sm">{userProfile.email}</span>
                  </div>
                   {!isEditing && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground break-words">{userProfile.bio}</p>
                   </div>
                   )}
              </div>
            </div>

            {isEditing ? (
              <div className="w-full grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="glow-shadow-primary">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save
                </Button>
              </div>
            ) : (
              <div className="w-full space-y-2">
                <Button onClick={() => setIsEditing(true)} className="w-full font-headline">Edit Profile</Button>
                <Button onClick={() => setShowSecureHub(true)} className="w-full font-headline bg-green-600/20 text-green-400 border border-green-500/50 hover:bg-green-600/30 hover:text-green-300">
                    <Shield className="h-4 w-4 mr-2" /> Enable Secure Hub
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
