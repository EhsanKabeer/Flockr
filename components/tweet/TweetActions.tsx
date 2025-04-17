"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Repeat2, Heart, Trash2 } from "lucide-react";
import { useLikeTweet } from "@/hooks/useTweets";
import { useAuth } from "@/hooks/useAuth";
import { deleteTweet } from "@/lib/firebase/firestore";
import { Tweet } from "@/types";
import toast from "react-hot-toast";

interface TweetActionsProps {
  tweet: Tweet;
  onComment?: () => void;
  onRetweet?: () => void;
  onDelete?: () => void;
}

export default function TweetActions({
  tweet,
  onComment,
  onRetweet,
  onDelete,
}: TweetActionsProps) {
  const { user } = useAuth();
  const { like, likedTweets, checkLiked } = useLikeTweet();
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      checkLiked(tweet.id, user.id).then(setIsLiked);
    }
  }, [tweet.id, user, checkLiked]);

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like tweets");
      return;
    }
    await like(tweet.id, user.id);
    setIsLiked(!isLiked);
  };

  const handleDelete = async () => {
    if (!user || tweet.userId !== user.id) return;

    if (!confirm("Are you sure you want to delete this tweet?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTweet(tweet.id);
      toast.success("Tweet deleted");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete tweet");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = user?.id === tweet.userId;

  return (
    <div className="flex items-center justify-between mt-2 px-2 py-1 max-w-md">
      <button
        onClick={onComment}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-accent/10 transition-colors group"
      >
        <MessageCircle className="w-5 h-5 text-foreground-muted group-hover:text-accent" />
        <span className="text-sm text-foreground-muted group-hover:text-accent">
          {tweet.commentsCount || 0}
        </span>
      </button>

      {!isOwner && (
        <button
          onClick={onRetweet}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-green-500/10 transition-colors group"
        >
          <Repeat2 className="w-5 h-5 text-foreground-muted group-hover:text-green-500" />
          <span className="text-sm text-foreground-muted group-hover:text-green-500">
            {tweet.retweetsCount || 0}
          </span>
        </button>
      )}

      <button
        onClick={handleLike}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-red-500/10 transition-colors group"
      >
        <Heart
          className={`w-5 h-5 ${
            isLiked
              ? "text-red-500 fill-red-500"
              : "text-foreground-muted group-hover:text-red-500"
          }`}
        />
        <span
          className={`text-sm ${
            isLiked
              ? "text-red-500"
              : "text-foreground-muted group-hover:text-red-500"
          }`}
        >
          {tweet.likesCount || 0}
        </span>
      </button>

      {isOwner && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-red-500/10 transition-colors group text-foreground-muted hover:text-error"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

