// lib/db.ts
import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');

type GlobalWithMongoose = typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>;
};
if (process.env.NODE_ENV === 'production') {
  mongoose.set('autoIndex', false); // ایندکس‌ها را دستی sync می‌کنیم
}

declare const global: GlobalWithMongoose;

export async function connectToDB(): Promise<typeof mongoose> {
  if (global._mongooseConn) return global._mongooseConn;

  global._mongooseConn = mongoose.connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
    appName: 'matchzone',
  } as ConnectOptions);

  mongoose.connection.on('connected', () => console.log('Mongo connected'));
  mongoose.connection.on('error', (err) => console.error('Mongo error', err));

  return global._mongooseConn;
}

// Backward compatible alias
export const connectDB = connectToDB;
