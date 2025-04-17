"use client";

import { Tweet } from "@/types";
import TweetCard from "./TweetCard";
import Loading from "@/components/ui/Loading";

interface TweetListProps {
  tweets: Tweet[];
  isLoading?: boolean;
}

export default function TweetList({ tweets, isLoading }: TweetListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Loading tweets..." />
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-foreground-muted text-lg mb-2">No tweets yet</p>
        <p className="text-foreground-muted text-sm">
          Be the first to tweet something!
        </p>
      </div>
    );
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}

