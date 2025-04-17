"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import TweetActions from "./TweetActions";
import { formatRelativeTime } from "@/lib/utils";
import { Tweet } from "@/types";
import Modal from "@/components/ui/Modal";
import CommentSection from "@/components/comment/CommentSection";

interface TweetCardProps {
  tweet: Tweet;
  onDelete?: () => void;
}

export default function TweetCard({ tweet, onDelete }: TweetCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <article className="border-b border-border p-4 hover:bg-background-hover/30 transition-colors">
        <div className="flex gap-4">
          <Link href={`/profile/${tweet.userId}`}>
            <Avatar
              src={tweet.user?.avatar}
              alt={tweet.user?.displayName || "User"}
              size="md"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/profile/${tweet.userId}`}>
                <span className="font-semibold text-foreground hover:underline">
                  {tweet.user?.displayName || "Unknown User"}
                </span>
              </Link>
              <span className="text-foreground-muted">
                @{tweet.user?.username || "unknown"}
              </span>
              <span className="text-foreground-muted">·</span>
              <time className="text-foreground-muted hover:underline" title={tweet.createdAt.toISOString()}>
                {formatRelativeTime(tweet.createdAt)}
              </time>
            </div>

            <div className="mb-3">
              <p className="text-foreground whitespace-pre-wrap break-words">
                {tweet.content}
              </p>
              {tweet.imageUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                  <Image
                    src={tweet.imageUrl}
                    alt="Tweet image"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>

            <TweetActions
              tweet={tweet}
              onComment={() => setShowComments(true)}
              onRetweet={() => {
                // Retweet functionality will be implemented
                console.log("Retweet", tweet.id);
              }}
              onDelete={onDelete}
            />
          </div>
        </div>
      </article>

      <Modal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        title="Comments"
        size="lg"
      >
        <CommentSection tweetId={tweet.id} />
      </Modal>
    </>
  );
}

