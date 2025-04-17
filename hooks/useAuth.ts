"use client";

import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { currentUserState } from "@/lib/recoil/atoms";
import { getUser } from "@/lib/firebase/firestore";
import { User } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  useEffect(() => {
    if (session?.user?.id && !currentUser) {
      getUser(session.user.id).then((user) => {
        if (user) {
          setCurrentUser(user);
        }
      });
    }
  }, [session, currentUser, setCurrentUser]);

  return {
    user: currentUser || (session?.user ? {
      id: session.user.id,
      email: session.user.email || "",
      username: session.user.username || "",
      displayName: session.user.displayName || session.user.name || "",
      avatar: session.user.avatar || "",
      createdAt: new Date(),
      followersCount: 0,
      followingCount: 0,
    } as User : null),
    session,
    isLoading: status === "loading",
    isAuthenticated: !!session,
  };
}

