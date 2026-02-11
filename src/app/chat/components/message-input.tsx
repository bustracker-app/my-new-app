'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  text: z.string().min(1),
});

interface MessageInputProps {
    chatId: string;
    senderId: string;
}

export default function MessageInput({ chatId, senderId }: MessageInputProps) {
    const [isSending, setIsSending] = useState(false);
    const firestore = useFirestore();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: "" },
    });
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!firestore) return;
        setIsSending(true);

        const messagesRef = collection(firestore, 'chats', chatId, 'messages');
        const chatRef = doc(firestore, 'chats', chatId);
        
        // Simulate encryption
        const encryptedText = btoa(values.text);

        const messagePayload = {
            senderId: senderId,
            text: values.text, // For UI display
            encryptedText: encryptedText, // For storage
            timestamp: serverTimestamp(),
            seen: false,
            messageId: '', // placeholder
        };

        addDoc(messagesRef, messagePayload)
          .then(() => {
            updateDoc(chatRef, {
                lastMessage: values.text,
                lastMessageTime: serverTimestamp()
            }).catch(updateError => {
                const permissionError = new FirestorePermissionError({
                    path: chatRef.path,
                    operation: 'update',
                    requestResourceData: { lastMessage: values.text }
                });
                errorEmitter.emit('permission-error', permissionError);
            })
            form.reset();
          })
          .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: messagesRef.path,
                operation: 'create',
                requestResourceData: messagePayload
            });
            errorEmitter.emit('permission-error', permissionError);
          })
          .finally(() => {
            setIsSending(false);
          });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input 
                                    placeholder="Transmit secure message..." 
                                    autoComplete="off"
                                    {...field}
                                    className="bg-background/50"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" size="icon" disabled={isSending} className="glow-shadow-primary">
                    <SendHorizonal className="h-5 w-5"/>
                </Button>
            </form>
        </Form>
    )
}
