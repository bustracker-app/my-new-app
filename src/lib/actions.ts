'use client';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

export const getOrCreateChat = async (
  firestore: Firestore,
  currentUserId: string,
  otherUserId: string
): Promise<string> => {
  const chatsRef = collection(firestore, 'chats');

  const q1 = query(
    chatsRef,
    where('participants', '==', [currentUserId, otherUserId])
  );
  const q2 = query(
    chatsRef,
    where('participants', '==', [otherUserId, currentUserId])
  );

  const [querySnapshot1, querySnapshot2] = await Promise.all([
    getDocs(q1),
    getDocs(q2),
  ]);

  const existingChat =
    querySnapshot1.docs[0] || querySnapshot2.docs[0];

  if (existingChat) {
    return existingChat.id;
  } else {
    const newChatDoc = await addDoc(chatsRef, {
      participants: [currentUserId, otherUserId],
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      isBroadcast: false,
    });
    return newChatDoc.id;
  }
};
