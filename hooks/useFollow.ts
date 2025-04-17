"use client";

import { useState, useEffect } from "react";
import {
  followUser,
  unfollowUser,
  checkIfFollowing,
  getFollowing,
} from "@/lib/firebase/firestore";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export function useFollow(followingId: string) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowingAction, setIsFollowingAction] = useState(false);

  useEffect(() => {
    if (user && followingId) {
      checkIfFollowing(user.id, followingId).then(setIsFollowing).finally(() => setIsLoading(false));
    }
  }, [user, followingId]);

  const follow = async () => {
    if (!user) {
      toast.error("You must be logged in to follow users");
      return;
    }

    setIsFollowingAction(true);
    try {
      await followUser(user.id, followingId);
      setIsFollowing(true);
      toast.success("Followed successfully");
    } catch (error) {
      toast.error("Failed to follow user");
    } finally {
      setIsFollowingAction(false);
    }
  };

  const unfollow = async () => {
    if (!user) {
      toast.error("You must be logged in to unfollow users");
      return;
    }

    setIsFollowingAction(true);
    try {
      await unfollowUser(user.id, followingId);
      setIsFollowing(false);
      toast.success("Unfollowed successfully");
    } catch (error) {
      toast.error("Failed to unfollow user");
    } finally {
      setIsFollowingAction(false);
    }
  };

  const toggleFollow = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return {
    isFollowing,
    isLoading,
    isFollowingAction,
    follow,
    unfollow,
    toggleFollow,
  };
}

