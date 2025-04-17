import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      username?: string;
      displayName?: string;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    username?: string;
    displayName?: string;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    displayName?: string;
    avatar?: string;
  }
}

