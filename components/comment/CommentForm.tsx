"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { createComment } from "@/lib/firebase/firestore";
import { validateTweet } from "@/lib/validation";
import toast from "react-hot-toast";

interface CommentFormProps {
  tweetId: string;
  parentId?: string;
  onCommentCreated?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  tweetId,
  parentId,
  onCommentCreated,
  placeholder = "Tweet your reply",
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }

    const validation = validateTweet(content);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid comment");
      return;
    }

    setIsLoading(true);
    try {
      await createComment({
        tweetId,
        userId: user.id,
        content: content.trim(),
        parentId,
      });
      toast.success("Comment posted!");
      setContent("");
      onCommentCreated?.();
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsLoading(false);
    }
  };

  const characterCount = content.length;
  const remainingChars = 280 - characterCount;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background-card border border-border rounded-lg p-3 text-foreground placeholder:text-foreground-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        rows={3}
        maxLength={280}
      />
      <div className="flex items-center justify-end gap-4">
        <span
          className={`text-sm ${
            remainingChars < 20 ? "text-error" : "text-foreground-muted"
          }`}
        >
          {characterCount}/280
        </span>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!content.trim() || isLoading}
        >
          Reply
        </Button>
      </div>
    </form>
  );
}

