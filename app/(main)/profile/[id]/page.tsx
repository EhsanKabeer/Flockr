"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useUser, useUserTweets } from "@/hooks/useUser";
import ProfileHeader from "@/components/profile/ProfileHeader";
import TweetList from "@/components/tweet/TweetList";
import Loading from "@/components/ui/Loading";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { user, isLoading: userLoading } = useUser(userId);
  const { tweets, isLoading: tweetsLoading } = useUserTweets(userId);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-foreground-muted">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProfileHeader user={user} />
      <div className="border-b border-border">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">Tweets</h2>
        </div>
      </div>
      <TweetList tweets={tweets} isLoading={tweetsLoading} />
    </div>
  );
}

