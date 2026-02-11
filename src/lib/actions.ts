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

  // Query to check if a chat exists with participants in one order
  const q1 = query(
    chatsRef,
    where('participants', '==', [currentUserId, otherUserId])
  );
  // Query to check if a chat exists with participants in the reverse order
  const q2 = query(
    chatsRef,
    where('participants', '==', [otherUserId, currentUserId])
  );

  // Execute both queries
  const [querySnapshot1, querySnapshot2] = await Promise.all([
    getDocs(q1),
    getDocs(q2),
  ]);

  // Check if any chat document was found in either query
  const existingChat =
    querySnapshot1.docs[0] || querySnapshot2.docs[0];

  if (existingChat) {
    // If a chat already exists, return its ID
    return existingChat.id;
  } else {
    // If no chat exists, create a new one
    const newChatDoc = await addDoc(chatsRef, {
      participants: [currentUserId, otherUserId],
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      isBroadcast: false,
    });
    return newChatDoc.id;
  }
};
