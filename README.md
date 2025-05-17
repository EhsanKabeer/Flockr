# Twitter Clone

A full-stack social media app built to replicate core Twitter features. Users can post tweets, like and retweet, comment, follow other users, and edit their profiles. Built this as a project to get hands-on with a real-time database and authentication flow.

## Features

- Post, delete, like, and retweet tweets
- Nested comment threads on tweets
- Follow and unfollow users
- Edit profile (display name, bio, avatar)
- Search users and tweets
- Real-time feed updates
- Image uploads on tweets

## Tech Stack

- **Next.js 14** (App Router) for the frontend and API routes
- **TypeScript** throughout
- **Tailwind CSS** for styling
- **Firebase** for the database, auth, and file storage
- **NextAuth.js** for session management
- **Recoil** for global client-side state

## Firebase Setup

This project uses three Firebase services:

**Firestore** is the main database. Collections include `users`, `tweets`, `comments`, `follows`, `retweets`, and `likes`. Likes and retweets are stored as subcollections or separate documents and use Firestore's `increment()` to keep counts in sync without reading the whole collection. The feed uses `onSnapshot` so tweets update in real time without needing to refresh.

**Firebase Auth** handles email/password accounts via the Firebase REST API (so it can run server-side inside NextAuth). Google OAuth is also supported. When a user signs up, a corresponding document is created in the `users` Firestore collection to store extra info like username, bio, and follower counts.

**Firebase Storage** stores tweet images and avatars. Uploaded files get a public download URL that is saved to Firestore with the tweet or user document.

On the server side, Firebase Admin SDK is used inside Next.js API routes and NextAuth callbacks, where the regular client SDK cannot run.
