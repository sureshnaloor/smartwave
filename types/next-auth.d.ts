import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique identifier */
      id: string;
      /** The authentication provider (e.g., "google", "credentials") */
      provider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    /** The user's unique identifier */
    id: string;
    /** The user's name */
    name?: string;
    /** The user's email */
    email?: string;
    /** The user's profile image */
    image?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's unique identifier */
    id?: string;
    /** The authentication provider */
    provider?: string;
  }
} 