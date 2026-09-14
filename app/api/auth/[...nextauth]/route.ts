import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserServer, createUserServer, getUserByUsernameServer } from "@/lib/firebase/firestore-server";
import { verifyPassword, createUserWithEmailPassword } from "@/lib/firebase/auth-rest";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", required: false },
        isSignUp: { label: "Is Sign Up", type: "checkbox", required: false },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          if (credentials.isSignUp) {
            // Sign up
            if (!credentials.username) {
              throw new Error("Username is required for sign up");
            }

            const existingByUsername = await getUserByUsernameServer(credentials.username);
            if (existingByUsername) {
              throw new Error("USERNAME_TAKEN");
            }

            // Create user with Firebase Auth REST API
            const authResult = await createUserWithEmailPassword(
              credentials.email,
              credentials.password
            );

            // Create user document in Firestore
            const userData = {
              id: authResult.localId,
              email: credentials.email,
              username: credentials.username,
              displayName: credentials.username,
              bio: "",
              avatar: "",
              createdAt: new Date(),
              followersCount: 0,
              followingCount: 0,
              tweetsCount: 0,
            };

            await createUserServer(userData);

            return {
              id: authResult.localId,
              email: credentials.email,
              name: credentials.username,
            };
          } else {
            // Sign in - verify password using Firebase Auth REST API
            const authResult = await verifyPassword(credentials.email, credentials.password);

            // Get user from Firestore
            let user = await getUserServer(authResult.localId);

            if (!user) {
              // The Auth account exists and the password is correct, but there is
              // no profile document. Sign-up writes the Auth account and the
              // Firestore profile as two separate, non-atomic steps, so a failure
              // between them strands the account: every later sign-in attempt
              // looks like a rejected password. Rather than lock the user out of
              // an account they can prove they own, backfill the profile here
              // from what Firebase Auth already knows.
              const fallbackUsername =
                credentials.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") ||
                `user_${authResult.localId.slice(0, 6)}`;

              await createUserServer({
                id: authResult.localId,
                email: credentials.email,
                username: fallbackUsername,
                displayName: fallbackUsername,
                bio: "",
                avatar: "",
                followersCount: 0,
                followingCount: 0,
                tweetsCount: 0,
              });

              user = await getUserServer(authResult.localId);

              if (!user) {
                throw new Error(
                  "Your account exists but its profile could not be created. Please try again."
                );
              }
            }

            return {
              id: user.id,
              email: user.email,
              name: user.displayName,
            };
          }
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const userDoc = await getUserServer(user.id);
          if (!userDoc) {
            // Create user if doesn't exist
            const userData = {
              id: user.id,
              email: user.email!,
              username: user.email!.split("@")[0],
              displayName: user.name || user.email!.split("@")[0],
              bio: "",
              avatar: user.image || "",
              createdAt: new Date(),
              followersCount: 0,
              followingCount: 0,
              tweetsCount: 0,
            };
            await createUserServer(userData);
          }
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const userData = await getUserServer(user.id);
        if (userData) {
          token.username = userData.username;
          token.displayName = userData.displayName;
          token.avatar = userData.avatar;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.displayName = token.displayName as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
