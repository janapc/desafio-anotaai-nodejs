import { Schema, model } from 'mongoose'
import { type Product } from '@entities/product'

export const productSchema = new Schema<Product>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, required: true, ref: 'categories' },
})

export const productModel = model<Product>('products', productSchema)
