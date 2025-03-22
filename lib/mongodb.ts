import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (!process.env.MONGODB_DB) {
  console.warn('MONGODB_DB not specified, defaulting to "smartwave"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let cachedDb: Db;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  if (cachedDb) {
    return { client, db: cachedDb };
  }

  if (!clientPromise) {
    throw new Error('MongoDB client promise was not initialized');
  }

  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || 'smartwave';
    const db = client.db(dbName);
    
    // Test the connection with a ping
    await db.command({ ping: 1 });
    console.log(`Connected to MongoDB database: ${dbName}`);
    
    cachedDb = db;
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Clear cached connection on error to force a reconnect on next try
    cachedDb = null as any;
    throw new Error('Unable to connect to MongoDB');
  }
}

// Export clientPromise for NextAuth.js
export default clientPromise; 