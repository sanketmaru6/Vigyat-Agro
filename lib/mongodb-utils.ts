import clientPromise from "@/lib/mongodb"
import type { Db, Collection, Document } from "mongodb"
import { ObjectId } from "mongodb"

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  const dbName = process.env.MONGODB_DB || "vigyat"
  return client.db(dbName)
}

export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getDb()
  return db.collection<T>(name)
}

export function newId(): string {
  return new ObjectId().toHexString()
}
