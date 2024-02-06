import { type Model } from 'mongoose'
import { type IProductRepository } from '@entities/repository'
import { type Product } from '@entities/product'
import { mongoDBToProductDomain } from './mappers'

export class MongoDbProductRepository implements IProductRepository {
  private readonly ProductModel: Model<Product>

  constructor(productModel: Model<Product>) {
    this.ProductModel = productModel
  }

  async register(product: Product): Promise<Product> {
    const data = new this.ProductModel(product)
    const result = await data.save()
    return mongoDBToProductDomain(result)
  }

  async update(product: Product): Promise<void> {
    await this.ProductModel.findByIdAndUpdate(product.id, product)
  }

  async findById(id: string): Promise<Product> {
    const product = await this.ProductModel.findById(id).populate('category')
    if (!product) {
      throw new Error('product is not found')
    }
    return product
  }

  async delete(id: string): Promise<void> {
    await this.ProductModel.findByIdAndDelete({ _id: id })
  }

  async all(): Promise<Product[]> {
    const products = await this.ProductModel.find().populate('category')
    return products.map((product) => mongoDBToProductDomain(product))
  }
}
