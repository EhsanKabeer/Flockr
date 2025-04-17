"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFollow } from "@/hooks/useFollow";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { User } from "@/types";
import Link from "next/link";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const { isFollowing, toggleFollow, isFollowingAction } = useFollow(user.id);
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="border-b border-border">
      <div className="h-48 bg-background-card" />
      <div className="px-6 pb-6">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <Avatar src={user.avatar} alt={user.displayName} size="xl" />
          {isOwnProfile ? (
            <Link href="/profile/edit">
              <Button variant="outline" size="md">
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Button
              variant={isFollowing ? "outline" : "primary"}
              size="md"
              onClick={toggleFollow}
              isLoading={isFollowingAction}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {user.displayName}
          </h1>
          <p className="text-foreground-muted mb-4">@{user.username}</p>
          {user.bio && (
            <p className="text-foreground mb-4 whitespace-pre-wrap">{user.bio}</p>
          )}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold text-foreground">{user.followingCount || 0}</span>
              <span className="text-foreground-muted ml-1">Following</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{user.followersCount || 0}</span>
              <span className="text-foreground-muted ml-1">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

