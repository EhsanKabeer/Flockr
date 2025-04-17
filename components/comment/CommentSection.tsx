"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { usersState } from "@/lib/recoil/atoms";
import { getComments, createComment, getUser } from "@/lib/firebase/firestore";
import { Comment } from "@/types";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import Loading from "@/components/ui/Loading";

interface CommentSectionProps {
  tweetId: string;
}

export default function CommentSection({ tweetId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useRecoilState(usersState);

  useEffect(() => {
    loadComments();
  }, [tweetId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(tweetId);
      
      // Fetch user data for comments
      const userIds = new Set(fetchedComments.map((comment) => comment.userId));
      const userPromises = Array.from(userIds).map((userId) => getUser(userId));
      const usersData = await Promise.all(userPromises);

      usersData.forEach((user) => {
        if (user) {
          setUsers((prev) => ({ ...prev, [user.id]: user }));
        }
      });

      const commentsWithUsers = fetchedComments.map((comment) => ({
        ...comment,
        user: usersData.find((u) => u?.id === comment.userId) || undefined,
      }));

      setComments(commentsWithUsers);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentCreated = () => {
    loadComments();
  };

  if (isLoading) {
    return <Loading size="md" text="Loading comments..." />;
  }

  return (
    <div className="space-y-4">
      <CommentForm tweetId={tweetId} onCommentCreated={handleCommentCreated} />
      <div className="space-y-4 border-t border-border pt-4">
        {comments.length === 0 ? (
          <p className="text-center text-foreground-muted py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

