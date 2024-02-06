import { Schema, model } from 'mongoose'
import { type Category } from '../../../entities/entities'

export const categorySchema = new Schema<Category>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: String, required: true },
})

export const categoryModel = model<Category>('categories', categorySchema)
