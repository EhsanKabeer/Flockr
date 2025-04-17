"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { usersState } from "@/lib/recoil/atoms";
import { getUser, getTweets } from "@/lib/firebase/firestore";
import { orderBy, where, limit } from "firebase/firestore";
import { User, Tweet } from "@/types";

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useRecoilState(usersState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser(userId);
        if (userData) {
          setUser(userData);
          setUsers((prev) => ({ ...prev, [userData.id]: userData }));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId, setUsers]);

  return { user, isLoading };
}

export function useUserTweets(userId: string) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTweets = async () => {
      setIsLoading(true);
      try {
        // Fetch this user's tweets
        const userTweets = await getTweets([
          where("userId", "==", userId),
          where("isRetweet", "==", false),
          orderBy("createdAt", "desc"),
          limit(50),
        ]);

        // Attach user data so TweetCard can render name/avatar correctly
        const userData = await getUser(userId);
        const tweetsWithUser = userTweets.map((tweet) => ({
          ...tweet,
          user: userData || tweet.user,
        }));

        setTweets(tweetsWithUser);
      } catch (error) {
        console.error("Error loading user tweets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadTweets();
    }
  }, [userId]);

  return { tweets, isLoading };
}

