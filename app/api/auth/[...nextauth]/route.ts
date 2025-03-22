import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import adapter from '@/lib/mongodbAdapter';
import { NextAuthOptions } from 'next-auth';
import { authOptions as libAuthOptions } from '@/lib/auth';

// Use the centralized auth options from lib/auth.ts
const handler = NextAuth(libAuthOptions);

export { handler as GET, handler as POST };