import { selector } from "recoil";
import { tweetsState, usersState, currentUserState, uiState } from "./atoms";
import { Tweet } from "@/types";

export const filteredTweetsSelector = selector({
  key: "filteredTweetsSelector",
  get: ({ get }) => {
    const tweets = get(tweetsState);
    const ui = get(uiState);
    const searchQuery = ui.searchQuery.toLowerCase();

    if (!searchQuery) return tweets;

    return tweets.filter(
      (tweet) =>
        tweet.content.toLowerCase().includes(searchQuery) ||
        tweet.user?.displayName.toLowerCase().includes(searchQuery) ||
        tweet.user?.username.toLowerCase().includes(searchQuery)
    );
  },
});

export const userFeedSelector = selector({
  key: "userFeedSelector",
  get: ({ get }) => {
    const tweets = get(tweetsState);
    const currentUser = get(currentUserState);
    const users = get(usersState);

    if (!currentUser) return [];

    const followingIds = Object.values(users)
      .filter((user) => {
        // This would be fetched from follows collection
        return user.followersCount > 0; // Simplified for now
      })
      .map((user) => user.id);

    const followingIdsSet = new Set(followingIds);
    followingIdsSet.add(currentUser.id);

    return tweets
      .filter((tweet) => followingIdsSet.has(tweet.userId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
});

export const userTweetsSelector = selector({
  key: "userTweetsSelector",
  get: () => {
    return (userId: string) => {
      return selector({
        key: `userTweetsSelector-${userId}`,
        get: ({ get }) => {
          const tweets = get(tweetsState);
          return tweets
            .filter((tweet) => tweet.userId === userId && !tweet.isRetweet)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        },
      });
    };
  },
});

export const exploreFeedSelector = selector({
  key: "exploreFeedSelector",
  get: ({ get }) => {
    const tweets = get(tweetsState);
    // Recoil snapshots can freeze state, so clone before sorting
    return [...tweets]
      .sort((a, b) => {
        // Sort by engagement (likes + retweets + comments)
        const engagementA = a.likesCount + a.retweetsCount + a.commentsCount;
        const engagementB = b.likesCount + b.retweetsCount + b.commentsCount;
        return engagementB - engagementA;
      })
      .slice(0, 50);
  },
});

