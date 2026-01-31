import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import adapter from "@/lib/mongodbAdapter";
import { compare } from "bcrypt";

// Ensure we have a secret for JWT signing
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is not set");
}

export const authOptions: NextAuthOptions = {
  adapter: adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT strategy for better compatibility
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin", // Use existing auth pages
    error: "/auth/error",
  },
  providers: [
    // Primary provider - Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials provider as fallback
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { db } = await import("@/lib/mongodb").then((mod) => 
            mod.connectToDatabase()
          );
          
          const user = await db.collection("users").findOne({ 
            email: credentials.email 
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Credentials sign-in is only for admin-created employees (email/password)
          if ((user as { role?: string }).role !== "employee") {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: "employee" as const,
            firstLoginDone: (user as { firstLoginDone?: boolean }).firstLoginDone ?? true,
          };
        } catch (error) {
          // console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all Google sign-ins by default
      if (account?.provider === "google") {
        return true;
      }
      
      // For credentials, ensure they have an email
      return !!user.email;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = (user as { role?: "user" | "employee" }).role ?? "user";
        token.firstLoginDone = (user as { firstLoginDone?: boolean }).firstLoginDone ?? true;
      }
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.provider = token.provider as string;
        session.user.role = (token.role as "user" | "employee") ?? "user";
        session.user.firstLoginDone = token.firstLoginDone ?? true;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
}; 