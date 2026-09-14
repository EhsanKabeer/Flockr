# Flockr

A full-stack social media app that replicates the core Twitter loop end to end. Users post, like, retweet and comment, follow and unfollow each other, search users and tweets, and edit their own profiles. It is built on Next.js 14 with the App Router and TypeScript, backed by Firebase for the database, authentication and file storage, with NextAuth handling sessions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [Deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

You need Node.js 18 or newer and a Firebase project. The Firebase project needs Firestore, Authentication with the Email/Password provider enabled, and Storage if you want image uploads on tweets.

```
node --version      # v18.0.0 or newer
npm --version
```

### Installing

Clone the repository and install dependencies.

```
git clone https://github.com/EhsanKabeer/Flockr.git
cd Flockr
npm install
```

Create a `.env.local` in the project root. The first block comes from your Firebase console's web app config, the second from a service account key generated under Project settings → Service accounts:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-openssl-rand-base64-32
```

Generate a `NEXTAUTH_SECRET` with:

```
openssl rand -base64 32
```

Start the development server:

```
npm run dev
```

Open `http://localhost:3000`, register an account, and post a tweet. The feed subscribes to Firestore directly, so the new tweet appears without a page reload — and appears in any other open session too.

## Running the tests

This project does not ship an automated test suite. Verification is done through linting, a type check, and a manual pass over the core loop.

```
npm run lint
```

### Break down into end to end tests

The behaviour worth checking end to end is the realtime feed and the counter integrity, since likes, retweets and comment counts are denormalised onto the tweet document and can drift from the underlying collections. The manual pass is: post a tweet, confirm it appears without a reload, like it and confirm the count increments once and only once, unlike it and confirm it returns to its previous value, then follow a second account and confirm both profiles' follower and following counts update.

```
npm run dev
# open http://localhost:3000 in two browser profiles with different accounts
```

### And coding style tests

TypeScript runs in strict mode, so the production build is itself a type check — a type error fails the build rather than reaching runtime.

```
npm run build
```

## Deployment

The project is built for Vercel, which is the path of least resistance for a Next.js App Router app.

```
npm run build
```

Push to GitHub and import the repository in Vercel. Add every variable from your `.env.local` to the Vercel project's environment variables, with two changes: set `NEXTAUTH_URL` to the deployed origin rather than `localhost`, and paste `FIREBASE_ADMIN_PRIVATE_KEY` with its literal `\n` sequences intact — the admin SDK will fail to initialise if they are expanded into real newlines by the dashboard.

Before going live, tighten the Firestore security rules. The development rules that let any authenticated user read and write are fine locally and are not safe in production.

## Built With

* [Next.js 14](https://nextjs.org/) - React framework, App Router and API routes
* [TypeScript](https://www.typescriptlang.org/) - Static typing throughout
* [Tailwind CSS](https://tailwindcss.com/) - Styling
* [Firebase](https://firebase.google.com/) - Firestore database, Authentication and Storage
* [NextAuth.js](https://next-auth.js.org/) - Session management
* [Recoil](https://recoiljs.org/) - Global client-side state
* [Lucide](https://lucide.dev/) - Icons

## Contributing

This is a personal portfolio project and is not accepting contributions, but you are welcome to fork it and build on it.

## Versioning

This project does not use formal version tags. History is tracked through the commit log on the [repository](https://github.com/EhsanKabeer/Flockr).

## Authors

* **Ehsan Kabeer** - *Initial work* - [EhsanKabeer](https://github.com/EhsanKabeer)

## License

No license has been specified for this project.

## Acknowledgments

* Twitter, for the interaction model this project reimplements
* The Next.js App Router documentation, especially on route groups, which shaped the `(auth)` and `(main)` layout split
