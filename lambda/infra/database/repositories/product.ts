import { type Model } from 'mongoose'
import { type IProductRepository } from '../../../entities/repository'
import { type Product } from '../../../entities/entities'

export class MongoDbProductRepository implements IProductRepository {
  constructor(private readonly ProductModel: Model<Product>) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.ProductModel.findById(id)
    if (!product) return null
    return {
      id: String(product._id),
      title: product.title,
      description: product.description,
      price: product.price,
      category: String(product.category),
      ownerId: product.ownerId,
    }
  }
}
