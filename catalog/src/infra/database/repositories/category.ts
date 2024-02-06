import { type Model } from 'mongoose'
import { type Category } from '@entities/category'
import { type ICategoryRepository } from '@entities/repository'
import { mongoDBToCategoryDomain } from './mappers'

export class MongoDbCategoryRepository implements ICategoryRepository {
  private readonly CategoryModel: Model<Category>
  constructor(model: Model<Category>) {
    this.CategoryModel = model
  }

  async register(category: Category): Promise<Category> {
    const data = new this.CategoryModel(category)
    const result = await data.save()
    return mongoDBToCategoryDomain(result)
  }

  async all(): Promise<Category[]> {
    const categories = await this.CategoryModel.find()
    return categories.map((category) => mongoDBToCategoryDomain(category))
  }

  async findById(id: string): Promise<Category> {
    const category = await this.CategoryModel.findById(id)
    if (!category) {
      throw new Error('category is not found')
    }
    return category
  }

  async update(category: Category): Promise<void> {
    await this.CategoryModel.findByIdAndUpdate(category.id, category)
  }

  async delete(id: string): Promise<void> {
    await this.CategoryModel.findByIdAndDelete({ _id: id })
  }
}
