"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTweets } from "@/hooks/useTweets";
import TweetForm from "@/components/tweet/TweetForm";
import TweetList from "@/components/tweet/TweetList";
import Loading from "@/components/ui/Loading";
import { useRecoilValue } from "recoil";
import { userFeedSelector } from "@/lib/recoil/selectors";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { tweets, isLoading } = useTweets();
  const feedTweets = useRecoilValue(userFeedSelector);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const displayTweets = feedTweets.length > 0 ? feedTweets : tweets;

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-foreground">Home</h1>
        </div>
      </div>
      <TweetForm />
      <TweetList tweets={displayTweets} isLoading={isLoading} />
    </div>
  );
}

