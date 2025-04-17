# Flockr

A full-stack social app built with Next.js 14+, TypeScript, Recoil JS, Tailwind CSS, NextAuth, and Firebase. This is a portfolio-ready project featuring a modern dark mode UI, real-time updates, and all core Twitter-like functionality.

## Features

### Authentication & User Management
- User registration and login (email/password)
- Google OAuth authentication
- User profiles with customizable avatars and bios
- Edit profile functionality
- Follow/unfollow users
- View followers and following counts

### Tweet Features
- Create tweets (text + optional images)
- View tweet feed (home feed from following users, explore feed from all users)
- Like/unlike tweets with real-time count updates
- Delete own tweets
- Real-time updates using Firestore listeners

### Comments/Replies
- Add comments/replies to tweets
- View comment threads
- Comment count display

### Search Functionality
- Search by username
- Search by tweet content
- Search filters (users, tweets)

### Additional Features
- Image upload for avatars and tweet images (Firebase Storage)
- Feed filtering (home - following, explore - all tweets, user's tweets)
- Real-time notifications for likes, comments
- Responsive design (mobile-first approach)
- Dark mode theme

## Tech Stack

- **Framework**: Next.js 14+ with App Router (TypeScript)
- **State Management**: Recoil JS with Recoil Persist
- **Styling**: Tailwind CSS with custom dark mode theme
- **Authentication**: NextAuth.js with Firebase Auth
- **Backend/Database**: Firebase (Firestore, Storage, Auth)
- **UI Libraries**: 
  - Lucide React (icons)
  - React Hot Toast (notifications)
  - date-fns (date formatting)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Firestore, Storage, and Authentication enabled
- Google OAuth credentials (optional, for Google sign-in)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Twitter_clone
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - (Optional) Enable Google provider and add OAuth credentials

3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see Security Rules section below)

4. Set up Firebase Storage:
   - Go to Storage
   - Get started with default rules
   - Update security rules (see Security Rules section below)

5. Get Firebase credentials:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Add a web app and copy the config values

6. Set up Firebase Admin SDK:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Copy the values to `.env.local`

### Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tweets collection
    match /tweets/{tweetId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Likes subcollection
      match /likes/{likeId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Retweets collection
    match /retweets/{retweetId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Follows collection
    match /follows/{followId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Firebase Storage Security Rules

Add these rules to your Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    match /tweets/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
Twitter_clone/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/          # Main application pages
│   │   ├── home/
│   │   ├── explore/
│   │   ├── search/
│   │   └── profile/
│   ├── api/
│   │   └── auth/        # NextAuth API routes
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/          # Layout components
│   ├── tweet/           # Tweet components
│   ├── comment/         # Comment components
│   ├── profile/         # Profile components
│   └── ui/              # Reusable UI components
├── lib/
│   ├── firebase/        # Firebase configuration and utilities
│   ├── recoil/          # Recoil state management
│   ├── utils.ts
│   └── validation.ts
├── types/
│   └── index.ts         # TypeScript type definitions
├── hooks/               # Custom React hooks
└── public/              # Static assets
```

## Key Features Implementation

### Authentication
- NextAuth handles authentication with Firebase Auth
- JWT sessions for client-side state management
- Protected routes using session checks

### Real-time Updates
- Firestore `onSnapshot` listeners for real-time data
- Recoil state automatically updates when data changes
- Components re-render via Recoil subscriptions

### Image Upload
- Firebase Storage for image hosting
- Image optimization using Next.js Image component
- File validation (type, size limits)

### State Management
- Recoil for global state (user, tweets, UI state)
- Local state for component-specific data
- Recoil Persist for session persistence

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Your own server with Node.js

Make sure to:
- Set all environment variables
- Configure Firebase for production
- Update `NEXTAUTH_URL` to your production domain

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

This is a portfolio project. Feel free to fork and modify for your own use.

## License

MIT License - feel free to use this project for your portfolio or learning purposes.

## Notes

- This is a portfolio project showcasing full-stack development skills
- Focus on code quality and best practices
- All features are fully functional and production-ready
- Dark mode theme provides excellent user experience
- Responsive design works on all screen sizes
