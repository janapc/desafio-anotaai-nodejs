import { type Category } from '@entities/category'
import { type ICategoryRepository } from '@entities/repository'

export class CategoryRepositoryMock implements ICategoryRepository {
  public categories: Category[] = []
  async register(category: Category): Promise<Category> {
    category.id = `test-${new Date().toISOString()}`
    this.categories.push(category)
    return category
  }

  async update(category: Category): Promise<void> {
    const categoryIndex = this.categories.findIndex(
      (item) => item.id === category.id,
    )
    if (categoryIndex >= 0) {
      this.categories[categoryIndex] = category
    }
  }

  async findById(id: string): Promise<Category> {
    const category = this.categories.find((c) => c.id === id)
    if (!category) {
      throw new Error('category is not found')
    }
    return category
  }

  async delete(id: string): Promise<void> {
    const categoryIndex = this.categories.findIndex((item) => item.id === id)
    this.categories.splice(categoryIndex, 1)
  }

  async all(): Promise<Category[]> {
    return this.categories
  }
}
