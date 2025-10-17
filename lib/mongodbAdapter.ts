import { MongoClient, ObjectId, Db } from 'mongodb';
import { Adapter, AdapterAccount, AdapterSession, VerificationToken } from 'next-auth/adapters';

const client = new MongoClient(process.env.MONGODB_URI || '');

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the MongoClient is not constantly created
  if (!(global as any)._mongoClientPromise) {
    clientPromise = client.connect();
    (global as any)._mongoClientPromise = clientPromise;
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  clientPromise = client.connect();
}

// Helper function to get database instance
const getDb = async (): Promise<Db> => {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'smartwave');
};

// Helper function to catch and log errors
const withErrorHandling = async <T>(operation: () => Promise<T>, fallback: T | null = null): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error('MongoDB adapter error:', error);
    return fallback;
  }
};

// Special version for void functions
const withVoidErrorHandling = async (operation: () => Promise<void>): Promise<void> => {
  try {
    await operation();
  } catch (error) {
    console.error('MongoDB adapter error:', error);
  }
};

const adapter: Adapter = {
  async createUser(profile: any) {
    return withErrorHandling(async () => {
      const db = await getDb();
      
      // Check if user already exists by email (could happen with Google auth)
      const existingUser = await db.collection('users').findOne({ email: profile.email });
      if (existingUser) {
        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          emailVerified: existingUser.emailVerified || null,
          name: existingUser.name || profile.name,
          image: existingUser.image || profile.image,
        };
      }
      
      // Create new user if doesn't exist
      const userData = {
        email: profile.email,
        name: profile.name,
        image: profile.image,
        emailVerified: profile.emailVerified || new Date(), // Google users are email verified
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const user = await db.collection('users').insertOne(userData);
      
      return { 
        id: user.insertedId.toString(), 
        email: userData.email,
        name: userData.name,
        image: userData.image,
        emailVerified: userData.emailVerified,
      };
    }, null) as any;
  },
  
  async getUser(id) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
        name: user.name || null,
        image: user.image || null,
      };
    });
  },
  
  async getUserByEmail(email) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const user = await db.collection('users').findOne({ email });
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
        name: user.name || null,
        image: user.image || null,
      };
    });
  },
  
  async getUserByAccount({ provider, providerAccountId }) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const account = await db.collection('accounts').findOne({
        provider,
        providerAccountId,
      });
      
      if (!account) return null;
      
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(account.userId) 
      });
      
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
        name: user.name || null,
        image: user.image || null,
      };
    });
  },
  
  async updateUser(user) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const { _id, ...userData } = user as any;
      const userId = _id ? new ObjectId(_id) : new ObjectId(user.id);
      
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { ...userData, updatedAt: new Date() } }
      );
      
      const updatedUser = await db.collection('users').findOne({ _id: userId });
      if (!updatedUser) throw new Error('User not found');
      
      return {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified || null,
        name: updatedUser.name || null,
        image: updatedUser.image || null,
      };
    }, null) as any;
  },
  
  async linkAccount(account: AdapterAccount) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const dbAccount = {
        ...account,
        userId: account.userId,
        createdAt: new Date(),
      };
      
      await db.collection('accounts').insertOne(dbAccount);
      return dbAccount;
    }, null) as any;
  },
  
  async createSession({ sessionToken, userId, expires }: AdapterSession) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const session = {
        sessionToken,
        userId,
        expires,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await db.collection('sessions').insertOne(session);
      
      return session;
    }, null) as any;
  },
  
  async getSessionAndUser(sessionToken: string) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const dbSession = await db.collection('sessions').findOne({ sessionToken });
      
      if (!dbSession) return null;
      
      // Check if the session is expired
      if (dbSession.expires && new Date(dbSession.expires) < new Date()) {
        // Session expired, delete it and return null
        await db.collection('sessions').deleteOne({ sessionToken });
        return null;
      }
      
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(dbSession.userId) 
      });
      
      if (!user) {
        // Invalid session - no user found
        await db.collection('sessions').deleteOne({ sessionToken });
        return null;
      }
      
      return {
        session: {
          sessionToken: dbSession.sessionToken,
          userId: dbSession.userId,
          expires: dbSession.expires
        },
        user: {
          id: user._id.toString(),
          email: user.email,
          emailVerified: user.emailVerified || null,
          name: user.name || null,
          image: user.image || null,
        }
      };
    });
  },
  
  async updateSession(session) {
    return withErrorHandling(async () => {
      const db = await getDb();
      
      // Must have sessionToken
      if (!session.sessionToken) return null;
      
      // Find session
      const dbSession = await db.collection('sessions').findOne({ 
        sessionToken: session.sessionToken 
      });
      if (!dbSession) return null;
      
      // Update the session
      await db.collection('sessions').updateOne(
        { sessionToken: session.sessionToken },
        { 
          $set: {
            expires: session.expires ?? dbSession.expires,
            ...(session.userId && { userId: session.userId }),
            updatedAt: new Date(),
          } 
        }
      );

      // Return updated session
      const updatedSession = await db.collection('sessions').findOne({ 
        sessionToken: session.sessionToken 
      });
      if (!updatedSession) return null;
      
      return {
        sessionToken: updatedSession.sessionToken,
        userId: updatedSession.userId,
        expires: updatedSession.expires,
      };
    });
  },
  
  async deleteSession(sessionToken: string) {
    await withVoidErrorHandling(async () => {
      const db = await getDb();
      await db.collection('sessions').deleteOne({ sessionToken });
    });
  },
  
  async createVerificationToken(token: VerificationToken) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const verificationToken = {
        ...token,
        createdAt: new Date(),
      };
      
      await db.collection('verification_tokens').insertOne(verificationToken);
      return token;
    }, null) as any;
  },
  
  async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
    return withErrorHandling(async () => {
      const db = await getDb();
      const result = await db.collection('verification_tokens')
        .findOneAndDelete({ identifier, token });
      
      if (!result || !result.value) return null;
      
      const { _id, createdAt, ...verificationToken } = result.value;
      return verificationToken;
    });
  },
  
  async deleteUser(userId) {
    await withVoidErrorHandling(async () => {
      const db = await getDb();
      await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
      await db.collection('accounts').deleteMany({ userId });
      await db.collection('sessions').deleteMany({ userId });
      // Don't delete user theme preferences - keep them for if user returns
    });
  },
};

export default adapter; 