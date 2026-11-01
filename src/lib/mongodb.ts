import "server-only";

import { MongoClient, type Db } from "mongodb";

const LEAD_COLLECTIONS = ["leads", "pilot_leads", "tarot_leads", "daemon_runs"];

type MongoGlobal = typeof globalThis & {
  __nexusyncMongo?: Promise<Db>;
};

async function connect(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "nexusync");

  // TTL: o Mongo remove sozinho os documentos após `deleteAfter` (retenção LGPD).
  await Promise.all([
    ...LEAD_COLLECTIONS.map((name) =>
      db
        .collection(name)
        .createIndex({ deleteAfter: 1 }, { expireAfterSeconds: 0 })
    ),
    db.collection("pilot_leads").createIndex({ createdAt: -1 }),
    db.collection("leaderboard").createIndex({ gameId: 1, score: -1 }),
  ]);

  return db;
}

export function getDb(): Promise<Db> {
  const globalState = globalThis as MongoGlobal;
  if (!globalState.__nexusyncMongo) {
    globalState.__nexusyncMongo = connect().catch((error) => {
      globalState.__nexusyncMongo = undefined;
      throw error;
    });
  }
  return globalState.__nexusyncMongo;
}
