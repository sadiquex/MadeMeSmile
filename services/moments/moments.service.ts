import { auth, db } from "@/firebase-config";
import { Moment } from "@/types";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export interface CreateMomentData {
  content: string;
  mediaType: "photo" | "video" | "audio" | "text";
  mediaUrl?: string;
  category: string;
  collection?: string;
  tags: string[];
  mood?: "happy" | "grateful" | "excited" | "peaceful";
}

export async function addMoment(momentData: CreateMomentData): Promise<void> {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const momentsRef = collection(db, "users", userId, "moments");

  await addDoc(momentsRef, {
    content: momentData.content,
    mediaType: momentData.mediaType,
    mediaUrl: momentData.mediaUrl || null,
    category: momentData.category,
    collection: momentData.collection || null,
    tags: momentData.tags || [],
    mood: momentData.mood || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likes: 0,
  });
}

export async function getMoments(): Promise<Moment[]> {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const momentsRef = collection(db, "users", userId, "moments");
    const q = query(momentsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const moments: Moment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      moments.push({
        id: doc.id,
        content: data.content,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        category: data.category,
        collection: data.collection,
        tags: data.tags || [],
        mood: data.mood,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        likes: data.likes || 0,
      });
    });

    return moments;
  } catch (error) {
    console.error("Error fetching moments:", error);
    throw new Error("Failed to fetch moments");
  }
}

export async function getMomentsByCategory(
  category: string
): Promise<Moment[]> {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const momentsRef = collection(db, "users", userId, "moments");
    const q = query(
      momentsRef,
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const moments: Moment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      moments.push({
        id: doc.id,
        content: data.content,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        category: data.category,
        collection: data.collection,
        tags: data.tags || [],
        mood: data.mood,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        likes: data.likes || 0,
      });
    });

    return moments;
  } catch (error) {
    console.error("Error fetching moments by category:", error);
    throw new Error("Failed to fetch moments by category");
  }
}
