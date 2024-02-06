import { type Model } from 'mongoose'
import { type Category } from '../../../entities/entities'
import { type ICategoryRepository } from '../../../entities/repository'

export class MongoDbCategoryRepository implements ICategoryRepository {
  constructor(private readonly CategoryModel: Model<Category>) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.CategoryModel.findById(id)
    if (!category) return null
    return {
      id: String(category._id),
      ownerId: category.ownerId,
      description: category.description,
      title: category.title,
    }
  }
}
