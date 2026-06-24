import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

let lastConnectionFailureAt = 0;

const MONGO_FAILURE_COOLDOWN_MS = 60_000;

export function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.');
  }
  return uri;
}

export function getMongoClient() {
  const now = Date.now();
  if (lastConnectionFailureAt && now - lastConnectionFailureAt < MONGO_FAILURE_COOLDOWN_MS) {
    throw new Error('MongoDB connection is temporarily unavailable.');
  }

  const uri = getMongoUri();

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 2_500,
      serverSelectionTimeoutMS: 2_500,
    });

    global.__mongoClientPromise = client.connect().catch((error) => {
      lastConnectionFailureAt = Date.now();
      global.__mongoClientPromise = undefined;
      throw error;
    });
  }

  return global.__mongoClientPromise;
}
