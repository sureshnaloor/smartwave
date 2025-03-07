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
  return client.db('smartwave');
};

const adapter: Adapter = {
  async createUser(profile: any) {
    const db = await getDb();
    const user = await db.collection('users').insertOne(profile);
    return { id: user.insertedId.toString(), ...profile, emailVerified: null };
  },
  async getUser(id) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      emailVerified: user.emailVerified || null,
    };
  },
  async getUserByEmail(email) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      emailVerified: user.emailVerified || null,
    };
  },
  async getUserByAccount({ provider, providerAccountId }) {
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
    };
  },
  async linkAccount(account: AdapterAccount) {
    const db = await getDb();
    await db.collection('accounts').insertOne(account);
  },
  async createSession(session: AdapterSession) {
    const db = await getDb();
    const result = await db.collection('sessions').insertOne(session);
    return { ...session, id: result.insertedId.toString() };
  },
  async getSessionAndUser(sessionToken: string) {
    const db = await getDb();
    const dbSession = await db.collection('sessions').findOne({ sessionToken });
    
    if (!dbSession) return null;
    
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(dbSession.userId) 
    });
    
    if (!user) return null;
    
    return {
      session: {
        id: dbSession._id.toString(),
        sessionToken: dbSession.sessionToken,
        userId: dbSession.userId,
        expires: dbSession.expires
      },
      user: {
        id: user._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
      }
    };
  },
  async deleteSession(sessionToken: string) {
    const db = await getDb();
    await db.collection('sessions').deleteOne({ sessionToken });
  },
  async createVerificationToken(token: VerificationToken) {
    const db = await getDb();
    const verificationToken = await db.collection('verification_tokens').insertOne(token);
    return {
      id: verificationToken.insertedId.toString(),
      ...token
    };
  },
  async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
    const db = await getDb();
    const result = await db.collection('verification_tokens')
      .findOneAndDelete({ identifier, token });
    
    if (!result || !result.value) return null;
    
    const verificationToken = result.value;
    return {
      id: verificationToken._id.toString(),
      identifier: verificationToken.identifier,
      token: verificationToken.token,
      expires: verificationToken.expires
    };
  },
  async updateSession(session: AdapterSession): Promise<AdapterSession | null> {
    const db = await getDb();
    
    // First try to find the session
    const existingSession = await db.collection('sessions').findOne({ 
      sessionToken: session.sessionToken 
    });

    if (!existingSession) return null;

    // Update the session
    await db.collection('sessions').updateOne(
      { sessionToken: session.sessionToken },
      { 
        $set: {
          expires: session.expires,
          userId: session.userId,
        } 
      }
    );

    return {
      id: existingSession._id.toString(),
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: session.expires
    };
  },
  // Implement other required adapter methods...
};

export default adapter; 