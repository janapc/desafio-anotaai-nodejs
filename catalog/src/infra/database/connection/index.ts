import mongoose from 'mongoose'

export async function connection(): Promise<void> {
  const uri = process.env.MONGO_DB_URI ?? ''
  await mongoose.connect(uri)
}
