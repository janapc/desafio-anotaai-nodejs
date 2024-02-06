import mongoose from 'mongoose'

export async function mongoDBConnection(): Promise<void> {
  const uri = String(process.env.MONGO_DB_URI) ?? ''
  await mongoose.connect(uri)
}
