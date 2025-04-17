# Flockr - Technical Project Specification

## Project Overview

This is a full-stack social media application that replicates core Twitter functionality. The project demonstrates modern web development practices using the Next.js framework, React for UI components, Firebase for backend services, and Recoil for state management. It's built as a portfolio project to showcase proficiency in full-stack development, real-time applications, and modern JavaScript frameworks.

## Technology Stack

### Frontend Framework
- **Next.js 14** with App Router: Server-side rendering framework built on React
- **TypeScript**: Type-safe JavaScript for better code quality and fewer bugs
- **React 18**: UI library for building interactive user interfaces

### State Management
- **Recoil**: Global state management library for React applications
- **Recoil Persist**: Plugin for persisting Recoil state to localStorage

### Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- Custom dark mode theme with carefully selected color palette
- Responsive design supporting mobile, tablet, and desktop screens

### Authentication
- **NextAuth.js**: Authentication library for Next.js applications
- **Firebase Authentication**: Backend authentication service
- Support for email/password and Google OAuth authentication methods

### Backend Services
- **Firebase Firestore**: NoSQL database for storing user data, tweets, comments, and relationships
- **Firebase Storage**: Cloud storage for user avatars and tweet images
- **Firebase Admin SDK**: Server-side Firebase operations for secure backend processing

### UI Libraries
- **Lucide React**: Icon library for consistent iconography
- **React Hot Toast**: Toast notification system for user feedback
- **date-fns**: Date formatting and manipulation library

## Core Features

### User Authentication and Profiles

The application includes a complete authentication system where users can register accounts, log in securely, and manage their profiles. Users can customize their display names, usernames, profile bios, and avatar images. The authentication flow uses JWT tokens managed by NextAuth.js, which integrate with Firebase Authentication for secure password handling.

### Tweet Management

Users can create text-based posts (tweets) with optional image attachments. The tweet creation interface includes character counting (280 character limit) and image preview functionality. Tweets are displayed in chronological order with real-time updates. Users can delete their own tweets, and all tweets show engagement metrics including likes, retweets, and comment counts.

### Social Interactions

The application supports several social interaction features:
- **Likes**: Users can like and unlike tweets with instant count updates
- **Comments**: Users can reply to tweets with threaded comment support
- **Retweets**: Users can share tweets (retweet functionality implemented)
- **Follow System**: Users can follow and unfollow other users, with follower/following counts displayed on profiles

### Real-Time Updates

All data updates happen in real-time using Firebase Firestore listeners. When a user likes a tweet or someone posts a new tweet, the changes appear immediately across all connected clients without requiring page refreshes. This creates a dynamic, live social media experience.

### Search Functionality

Users can search for other users by username or display name, and search for tweets by content. The search interface includes filters to toggle between searching users and tweets. Results update as the user types, providing instant feedback.

### Feed Management

Multiple feed views are available:
- **Home Feed**: Shows tweets from users you follow
- **Explore Feed**: Shows popular tweets from all users sorted by engagement
- **User Profile Feed**: Shows tweets from a specific user
- **Search Results**: Filtered tweets based on search queries

### Image Handling

The application includes image upload functionality for user avatars and tweet attachments. Images are validated for file type and size, uploaded to Firebase Storage, and displayed using Next.js Image optimization for fast loading times. Images are compressed and optimized automatically.

## Architecture and Design Patterns

### Project Structure

The codebase follows Next.js App Router conventions with organized folder structure:
- `app/`: Next.js pages and API routes using the App Router pattern
- `components/`: Reusable React components organized by feature
- `lib/`: Utility functions and configuration files
- `hooks/`: Custom React hooks for shared logic
- `types/`: TypeScript type definitions

### Component Architecture

Components are organized hierarchically:
- **Layout Components**: Header, Sidebar, FeedLayout for page structure
- **Feature Components**: TweetCard, TweetForm, CommentSection for specific features
- **UI Components**: Button, Input, Modal, Avatar for reusable UI elements
- **Page Components**: Home, Explore, Profile pages that compose smaller components

### State Management Strategy

Recoil is used for global application state including:
- Current authenticated user data
- Tweet list and cache
- User data cache
- UI state (modals, loading states, search queries)

Local React state is used for component-specific data like form inputs and temporary UI state. This creates a clear separation between global and local concerns.

### Data Flow

1. User actions trigger client-side functions
2. Functions call Firebase SDK methods (client-side) or API routes (server-side)
3. Firebase updates the database
4. Real-time listeners detect changes
5. Recoil state updates automatically
6. React components re-render with new data

### Authentication Flow

1. User submits login/registration form
2. Client sends credentials to NextAuth API route
3. API route verifies credentials using Firebase Auth REST API
4. NextAuth creates JWT session token
5. Session data stored in HTTP-only cookie
6. Client components access session via NextAuth React hooks
7. Protected routes check session before rendering

## Database Schema

### Collections

**users**: User profile information
- Fields: id, email, username, displayName, bio, avatar, createdAt, followersCount, followingCount, tweetsCount

**tweets**: All user posts
- Fields: id, userId, content, imageUrl, createdAt, likesCount, retweetsCount, commentsCount, isRetweet, originalTweetId

**comments**: Replies to tweets
- Fields: id, tweetId, userId, content, createdAt, parentId (for nested replies)

**likes**: User likes (subcollection under tweets)
- Fields: userId, createdAt

**retweets**: Retweet records
- Fields: id, userId, tweetId, comment, createdAt

**follows**: User follow relationships
- Fields: followerId, followingId, createdAt

## Security Considerations

### Authentication Security
- Passwords are handled by Firebase Authentication (never stored in plain text)
- JWT tokens stored in HTTP-only cookies
- Server-side session validation on protected routes

### Database Security
- Firestore security rules restrict data access based on authentication status
- Users can only modify their own data
- Read access is public for posts, write access requires authentication

### Input Validation
- All user inputs are validated before submission
- Character limits enforced (tweets: 280, bios: 160)
- File uploads validated for type and size
- SQL injection not applicable (NoSQL database)

### API Security
- Environment variables stored securely (not in code)
- Firebase Admin SDK credentials kept private
- API routes validate authentication before processing

## Performance Optimizations

### Image Optimization
- Next.js Image component used for automatic image optimization
- Images served in modern formats (WebP when supported)
- Lazy loading for images below the fold
- Responsive image sizes based on viewport

### Code Optimization
- Code splitting at the route level (Next.js automatic)
- Components only loaded when needed
- Memoization for expensive computations
- Efficient React re-renders using proper state management

### Database Optimization
- Indexed queries for fast searches
- Pagination for large datasets
- Caching user data in Recoil state
- Real-time listeners only on active views

### Bundle Size
- Tree shaking removes unused code
- Modern JavaScript features (ES6+)
- Minimal dependencies
- Optimized imports

## Development Practices

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Meaningful variable and function names
- Code comments for complex logic

### Error Handling
- Try-catch blocks for async operations
- User-friendly error messages via toast notifications
- Graceful fallbacks for failed operations
- Error boundaries for React component errors

### User Experience
- Loading states for async operations
- Optimistic UI updates where appropriate
- Smooth animations and transitions
- Accessible form inputs and buttons
- Responsive design for all screen sizes

## Deployment

The application is designed for deployment on Vercel (recommended) or any Node.js hosting platform. Environment variables must be configured in the hosting platform's dashboard. Firebase project must be configured for production environment. The application builds as a static site where possible, with server-side rendering for dynamic content.

## Learning Outcomes

This project demonstrates:
- Full-stack development skills (frontend and backend)
- Modern React patterns and Next.js App Router
- Real-time application development
- State management with Recoil
- Firebase integration (Auth, Firestore, Storage)
- Authentication and authorization implementation
- Responsive web design
- TypeScript for type-safe development
- Production-ready code practices

## Future Enhancements

Potential features that could be added:
- Notifications system
- Direct messaging between users
- Tweet threading and quote tweets
- Advanced search with filters
- Trending topics algorithm
- User mentions and hashtags
- Media gallery views
- Accessibility improvements (ARIA labels, keyboard navigation)
- Unit and integration tests
- Performance monitoring

## Conclusion

This Flockr project represents a complete full-stack web application built with modern technologies and best practices. It demonstrates proficiency in React, Next.js, Firebase, and related technologies while implementing core social media features with real-time capabilities. The codebase is well-organized, type-safe, and production-ready, making it suitable for portfolio presentation to potential employers.

