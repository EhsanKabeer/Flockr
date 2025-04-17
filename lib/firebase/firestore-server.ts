import { getAdminDb } from "./server-config";
import { User } from "@/types";

// Server-side Firestore operations using Admin SDK
export const getUserServer = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getAdminDb().collection("users").doc(userId).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      return {
        ...data,
        id: userDoc.id,
        createdAt: data?.createdAt?.toDate() || new Date(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user (server):", error);
    return null;
  }
};

/** Returns a user with the given username, or null if none. Used to enforce unique usernames. */
export const getUserByUsernameServer = async (username: string): Promise<User | null> => {
  try {
    const snapshot = await getAdminDb()
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data?.createdAt?.toDate() || new Date(),
    } as User;
  } catch (error) {
    console.error("Error getting user by username (server):", error);
    return null;
  }
};

export const createUserServer = async (userData: Omit<User, "createdAt">): Promise<void> => {
  try {
    await getAdminDb().collection("users").doc(userData.id).set({
      ...userData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user (server):", error);
    throw error;
  }
};

/** Create a tweet server-side (bypasses client Firestore auth). Use from API routes after verifying session. */
export const createTweetServer = async (data: {
  userId: string;
  content: string;
  imageUrl?: string;
}): Promise<string> => {
  const db = getAdminDb();
  const ref = await db.collection("tweets").add({
    userId: data.userId,
    content: data.content.trim(),
    ...(data.imageUrl != null && data.imageUrl !== "" ? { imageUrl: data.imageUrl } : {}),
    createdAt: new Date(),
    likesCount: 0,
    retweetsCount: 0,
    commentsCount: 0,
    isRetweet: false,
  });
  return ref.id;
};

