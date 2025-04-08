import NextAuth from 'next-auth';

import { authOptions as libAuthOptions } from '@/lib/auth';

// Use the centralized auth options from lib/auth.ts
const handler = NextAuth(libAuthOptions);

export { handler as GET, handler as POST };