"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { uiState } from "@/lib/recoil/atoms";
import { Search, User, MessageSquare } from "lucide-react";
import { useTweets } from "@/hooks/useTweets";
import { getTweets, getUsers } from "@/lib/firebase/firestore";
import { orderBy, limit } from "firebase/firestore";
import { User as UserType, Tweet } from "@/types";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import TweetList from "@/components/tweet/TweetList";
import Loading from "@/components/ui/Loading";

export default function SearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ui, setUi] = useRecoilState(uiState);
  const [searchQuery, setSearchQuery] = useState(ui.searchQuery || "");
  const [users, setUsers] = useState<UserType[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"tweets" | "users">("tweets");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setUsers([]);
      setTweets([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      // Search users (simple prefix search - Firestore doesn't support full-text search)
      // In production, you'd want to use Algolia or similar for better search
      const allUsers = await getUsers([]);
      const filteredUsers = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filteredUsers.slice(0, 20));

      // Search tweets
      const tweetsRef = await getTweets([
        orderBy("createdAt", "desc"),
        limit(50),
      ]);
      const filteredTweets = tweetsRef.filter((tweet) =>
        tweet.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Attach user objects so TweetCard can show names instead of "Unknown User"
      const userMap = new Map(allUsers.map((u) => [u.id, u]));
      const tweetsWithUsers = filteredTweets.map((tweet) => ({
        ...tweet,
        user: userMap.get(tweet.userId) || tweet.user,
      }));

      setTweets(tweetsWithUsers);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setUi({ ...ui, searchQuery: value });
  };

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

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search Flockr"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-background-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground placeholder:text-foreground-muted"
            />
          </div>
          <div className="flex gap-8 border-b border-border -mb-4">
            <button
              onClick={() => setActiveTab("tweets")}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === "tweets"
                  ? "border-accent text-foreground"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              <MessageSquare className="inline w-5 h-5 mr-2" />
              Tweets
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === "users"
                  ? "border-accent text-foreground"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              <User className="inline w-5 h-5 mr-2" />
              Users
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Searching..." />
        </div>
      ) : searchQuery.trim() ? (
        activeTab === "tweets" ? (
          <TweetList tweets={tweets} isLoading={false} />
        ) : (
          <div className="divide-y divide-border">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <p className="text-foreground-muted text-lg mb-2">No users found</p>
                <p className="text-foreground-muted text-sm">
                  Try searching with a different query
                </p>
              </div>
            ) : (
              users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-background-hover/30 transition-colors"
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.displayName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground hover:underline">
                      {user.displayName}
                    </h3>
                    <p className="text-foreground-muted">@{user.username}</p>
                    {user.bio && (
                      <p className="text-foreground-muted text-sm mt-1 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Search className="w-12 h-12 text-foreground-muted mb-4" />
          <p className="text-foreground-muted text-lg mb-2">Search for users or tweets</p>
          <p className="text-foreground-muted text-sm">
            Try searching for a username or tweet content
          </p>
        </div>
      )}
    </div>
  );
}

