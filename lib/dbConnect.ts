import { MongoClient, type MongoClientOptions } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined;
}

const mongoClientOptions: MongoClientOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

export function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.');
  }
  return uri;
}

export function getMongoClient() {
  const uri = getMongoUri();

  if (global.__mongoClient) {
    return Promise.resolve(global.__mongoClient);
  }

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri, mongoClientOptions);
    global.__mongoClientPromise = client
      .connect()
      .then((connectedClient) => {
        global.__mongoClient = connectedClient;
        return connectedClient;
      })
      .catch(async (error) => {
        global.__mongoClientPromise = undefined;
        global.__mongoClient = undefined;

        try {
          await client.close();
        } catch {
          // Ignore close errors after a failed connect attempt.
        }

        throw error;
      });
  }

  return global.__mongoClientPromise;
}
