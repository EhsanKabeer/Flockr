export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
  tweetsCount?: number;
}

export interface Tweet {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likesCount: number;
  retweetsCount: number;
  commentsCount: number;
  isRetweet: boolean;
  originalTweetId?: string;
  retweetedBy?: string;
  retweetComment?: string;
  user?: User;
}

export interface Like {
  id: string;
  userId: string;
  tweetId: string;
  createdAt: Date;
}

export interface Retweet {
  id: string;
  userId: string;
  tweetId: string;
  comment?: string;
  createdAt: Date;
  user?: User;
}

export interface Comment {
  id: string;
  tweetId: string;
  userId: string;
  content: string;
  createdAt: Date;
  parentId?: string;
  user?: User;
  repliesCount?: number;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface UserStats {
  tweetsCount: number;
  followersCount: number;
  followingCount: number;
}

