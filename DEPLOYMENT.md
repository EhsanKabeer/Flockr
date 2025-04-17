# Quick Deployment Guide - Get Running in Under 1 Hour

This guide will help you get the Flockr app up and running quickly. Follow these steps in order.

## Prerequisites

- Node.js 18+ installed
- A Firebase account (free tier works)
- A Google account (optional, for OAuth)

## Step 1: Clone and Install (5 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd Twitter_clone

# Install dependencies
npm install
```

## Step 2: Set Up Firebase (15 minutes)

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "twitter-clone")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password** provider
4. (Optional) Enable **Google** provider and follow setup instructions

### 2.3 Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Production mode** (we'll add rules later)
3. Select a location (choose closest to you)
4. Click **Enable**

### 2.4 Set Up Firestore Security Rules

1. Go to **Firestore Database** > **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /tweets/{tweetId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      
      match /likes/{likeId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /retweets/{retweetId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /follows/{followId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### 2.5 Set Up Firebase Storage

1. Go to **Storage** > **Get started**
2. Choose **Start in production mode**
3. Click **Next** > **Done**
4. Go to **Rules** tab and replace with:

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

5. Click **Publish**

### 2.6 Get Firebase Config

1. Go to **Project Settings** (gear icon) > **General** tab
2. Scroll to **Your apps** section
3. Click **Web** icon (`</>`)
4. Register app with nickname (e.g., "web")
5. Copy the config values (you'll need these next)

### 2.7 Get Firebase Admin SDK Credentials

1. Go to **Project Settings** > **Service Accounts** tab
2. Click **Generate new private key**
3. Click **Generate key** (JSON file downloads)
4. **IMPORTANT**: Keep this file secure - never commit it to git
5. Open the JSON file and copy these values:
   - `project_id`
   - `client_email`
   - `private_key`

## Step 3: Set Up Environment Variables (5 minutes)

1. In the project root, create a file named `.env.local`

2. Copy this template and fill in your values:

```env
# Firebase Configuration (from Step 2.6)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (from Step 2.7 JSON file)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key_here"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_random_secret_here

# Google OAuth (optional - only if you enabled Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. **Generate NEXTAUTH_SECRET**:
   - Run: `openssl rand -base64 32`
   - Or use an online generator
   - Copy the output to `NEXTAUTH_SECRET`

4. **For FIREBASE_ADMIN_PRIVATE_KEY**: 
   - Copy the entire `private_key` value from the JSON file
   - Keep the quotes and include all `\n` characters
   - Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"`

## Step 4: Run the Application (2 minutes)

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application (5 minutes)

1. Click "Sign up" to create an account
2. Fill in your details and register
3. You should be redirected to the home page
4. Try creating a tweet
5. Test other features (like, comment, search, profile)

## Troubleshooting

### Build Errors

If `npm run dev` fails:
- Make sure all environment variables are set in `.env.local`
- Check that Node.js version is 18+
- Try deleting `node_modules` and running `npm install` again

### Authentication Errors

- Verify Firebase Authentication is enabled
- Check that email/password provider is enabled
- Ensure all Firebase environment variables are correct

### Database Errors

- Verify Firestore is created and rules are published
- Check that security rules are correct
- Make sure you're using the correct project ID

### Image Upload Errors

- Verify Firebase Storage is set up
- Check Storage rules are published
- Ensure storage bucket name matches environment variable

## Deployment to Production

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Add all environment variables from `.env.local`
6. Click "Deploy"

### Important Notes

- Never commit `.env.local` to git
- Use production Firebase project for deployment
- Update `NEXTAUTH_URL` to your production domain
- Update Firebase security rules if needed for production

## Quick Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created with rules
- [ ] Firebase Storage set up with rules
- [ ] Firebase config copied
- [ ] Admin SDK credentials downloaded
- [ ] `.env.local` file created with all variables
- [ ] `npm install` completed
- [ ] `npm run dev` runs successfully
- [ ] Can register and login
- [ ] Can create tweets
- [ ] Can upload images

## Estimated Time Breakdown

- Step 1: 5 minutes
- Step 2: 15 minutes
- Step 3: 5 minutes
- Step 4: 2 minutes
- Step 5: 5 minutes
- **Total: ~32 minutes**

With some buffer time, you should be running in under an hour!

