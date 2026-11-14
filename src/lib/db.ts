import mongoose from "mongoose";
import { AppError } from "./api-response";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export function isDatabaseConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return Boolean(
    uri &&
      uri.trim().length > 0 &&
      !uri.includes("<username>") &&
      !uri.includes("<password>")
  );
}

/**
 * Establishes and caches a singleton Mongoose connection safe for serverless functions.
 */
export async function dbConnect(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim().length === 0) {
    throw new AppError(
      "Database connection string is not configured.",
      503,
      "DATABASE_NOT_CONFIGURED"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

