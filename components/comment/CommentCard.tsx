"use client";

import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { formatRelativeTime } from "@/lib/utils";
import { Comment } from "@/types";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-3 p-4 border-b border-border last:border-0">
      <Link href={`/profile/${comment.userId}`}>
        <Avatar
          src={comment.user?.avatar}
          alt={comment.user?.displayName || "User"}
          size="sm"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link href={`/profile/${comment.userId}`}>
            <span className="font-semibold text-foreground hover:underline">
              {comment.user?.displayName || "Unknown User"}
            </span>
          </Link>
          <span className="text-foreground-muted">
            @{comment.user?.username || "unknown"}
          </span>
          <span className="text-foreground-muted">·</span>
          <time className="text-foreground-muted text-sm">
            {formatRelativeTime(comment.createdAt)}
          </time>
        </div>
        <p className="text-foreground whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

