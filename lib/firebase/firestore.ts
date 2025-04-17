import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  QueryConstraint,
  addDoc,
  increment,
} from "firebase/firestore";
import { db } from "./config";
import { User, Tweet, Comment, Follow, Like, Retweet } from "@/types";

// User operations
export const createUser = async (userData: Omit<User, "createdAt">): Promise<void> => {
  const userRef = doc(db, "users", userData.id);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      id: userSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as User;
  }
  return null;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, updates as any);
};

// Tweet operations
export const createTweet = async (tweetData: Omit<Tweet, "id" | "createdAt">): Promise<string> => {
  if (!tweetData?.userId || !tweetData?.content?.trim()) {
    throw new Error("userId and content are required");
  }
  if (!db) {
    throw new Error("Firestore is not initialized");
  }
  const tweetsRef = collection(db, "tweets");
  // Firestore does not allow undefined; write only known fields with defined values
  const payload: Record<string, unknown> = {
    userId: tweetData.userId,
    content: tweetData.content,
    createdAt: serverTimestamp(),
    likesCount: 0,
    retweetsCount: 0,
    commentsCount: 0,
    isRetweet: false,
  };
  if (tweetData.imageUrl != null && tweetData.imageUrl !== "") {
    payload.imageUrl = tweetData.imageUrl;
  }
  const docRef = await addDoc(tweetsRef, payload);
  return docRef.id;
};

export const getTweet = async (tweetId: string): Promise<Tweet | null> => {
  const tweetRef = doc(db, "tweets", tweetId);
  const tweetSnap = await getDoc(tweetRef);
  if (tweetSnap.exists()) {
    const data = tweetSnap.data();
    return {
      ...data,
      id: tweetSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Tweet;
  }
  return null;
};

export const getTweets = async (constraints: QueryConstraint[] = []): Promise<Tweet[]> => {
  const tweetsRef = collection(db, "tweets");
  const q = query(tweetsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Tweet;
  });
};

export const deleteTweet = async (tweetId: string): Promise<void> => {
  const tweetRef = doc(db, "tweets", tweetId);
  await deleteDoc(tweetRef);
};

export const subscribeToTweets = (
  constraints: QueryConstraint[],
  callback: (tweets: Tweet[]) => void
): (() => void) => {
  const tweetsRef = collection(db, "tweets");
  const q = query(tweetsRef, ...constraints);
  return onSnapshot(q, (snapshot) => {
    const tweets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Tweet;
    });
    callback(tweets);
  });
};

// Like operations
export const likeTweet = async (userId: string, tweetId: string): Promise<void> => {
  const likeRef = doc(db, "tweets", tweetId, "likes", userId);
  await setDoc(likeRef, {
    userId,
    createdAt: serverTimestamp(),
  });
  const tweetRef = doc(db, "tweets", tweetId);
  await updateDoc(tweetRef, {
    likesCount: increment(1),
  });
};

export const unlikeTweet = async (userId: string, tweetId: string): Promise<void> => {
  const likeRef = doc(db, "tweets", tweetId, "likes", userId);
  await deleteDoc(likeRef);
  const tweetRef = doc(db, "tweets", tweetId);
  await updateDoc(tweetRef, {
    likesCount: increment(-1),
  });
};

export const checkIfLiked = async (userId: string, tweetId: string): Promise<boolean> => {
  const likeRef = doc(db, "tweets", tweetId, "likes", userId);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
};

// Retweet operations
export const retweet = async (
  userId: string,
  tweetId: string,
  comment?: string
): Promise<void> => {
  const retweetsRef = collection(db, "retweets");
  await addDoc(retweetsRef, {
    userId,
    tweetId,
    comment: comment || null,
    createdAt: serverTimestamp(),
  });
  const tweetRef = doc(db, "tweets", tweetId);
  await updateDoc(tweetRef, {
    retweetsCount: increment(1),
  });
};

export const unretweet = async (userId: string, tweetId: string): Promise<void> => {
  const retweetsRef = collection(db, "retweets");
  const q = query(retweetsRef, where("userId", "==", userId), where("tweetId", "==", tweetId));
  const querySnapshot = await getDocs(q);
  querySnapshot.docs.forEach(async (docSnap) => {
    await deleteDoc(docSnap.ref);
  });
  const tweetRef = doc(db, "tweets", tweetId);
  await updateDoc(tweetRef, {
    retweetsCount: increment(-1),
  });
};

// Comment operations
export const createComment = async (
  commentData: Omit<Comment, "id" | "createdAt">
): Promise<string> => {
  const commentsRef = collection(db, "comments");
  const docRef = await addDoc(commentsRef, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
  const tweetRef = doc(db, "tweets", commentData.tweetId);
  await updateDoc(tweetRef, {
    commentsCount: increment(1),
  });
  return docRef.id;
};

export const getComments = async (tweetId: string): Promise<Comment[]> => {
  const commentsRef = collection(db, "comments");
  const q = query(
    commentsRef,
    where("tweetId", "==", tweetId),
    where("parentId", "==", null),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Comment;
  });
};

// Follow operations
export const followUser = async (followerId: string, followingId: string): Promise<void> => {
  const followRef = doc(db, "follows", `${followerId}_${followingId}`);
  await setDoc(followRef, {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });
  const followerRef = doc(db, "users", followerId);
  const followingRef = doc(db, "users", followingId);
  await updateDoc(followerRef, {
    followingCount: increment(1),
  });
  await updateDoc(followingRef, {
    followersCount: increment(1),
  });
};

export const unfollowUser = async (followerId: string, followingId: string): Promise<void> => {
  const followRef = doc(db, "follows", `${followerId}_${followingId}`);
  await deleteDoc(followRef);
  const followerRef = doc(db, "users", followerId);
  const followingRef = doc(db, "users", followingId);
  await updateDoc(followerRef, {
    followingCount: increment(-1),
  });
  await updateDoc(followingRef, {
    followersCount: increment(-1),
  });
};

export const checkIfFollowing = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  const followRef = doc(db, "follows", `${followerId}_${followingId}`);
  const followSnap = await getDoc(followRef);
  return followSnap.exists();
};

export const getFollowing = async (userId: string): Promise<string[]> => {
  const followsRef = collection(db, "follows");
  const q = query(followsRef, where("followerId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data().followingId);
};

export const getUsers = async (constraints: QueryConstraint[] = []): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as User;
  });
};

