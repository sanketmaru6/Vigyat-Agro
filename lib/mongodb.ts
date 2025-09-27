import { MongoClient } from "mongodb"

// Use a global cached client in development to avoid creating multiple connections during HMR
// See: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-connections
let client: MongoClient | undefined
let clientPromise!: Promise<MongoClient>

const uri = process.env.MONGODB_URI

// Optional diagnostics/workarounds controlled by env vars
// Set MONGODB_TLS_INSECURE=true to allow invalid TLS certs/hostnames (development ONLY)
// Set MONGODB_USE_SERVER_API_V1=true to enable MongoDB Stable API V1 (can help with some environments)
const tlsInsecure = process.env.MONGODB_TLS_INSECURE === "true"
const useServerApiV1 = process.env.MONGODB_USE_SERVER_API_V1 === "true"

const options: any = {
  ...(tlsInsecure
    ? { tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true }
    : {}),
  ...(useServerApiV1
    ? { serverApi: { version: "1", strict: true, deprecationErrors: true } }
    : {}),
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!uri) {
  // Export a rejected promise so callers can catch and respond gracefully
  clientPromise = Promise.reject(
    new Error("Missing MONGODB_URI environment variable. Add it to your .env.local"),
  ) as unknown as Promise<MongoClient>
} else {
  if (process.env.NODE_ENV !== "production") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise
