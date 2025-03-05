import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import adapter from '@/lib/mongodbAdapter';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: adapter,
  pages: {
    signIn: '/auth/signin', // Optional: Custom sign-in page
    verifyRequest: '/auth/verify-request', // verification request page
    error: '/auth/error', // Error page
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "google") {
        return true; // Google accounts are pre-verified
      }
      return !!user.emailVerified; // Email sign-in requires verification
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 