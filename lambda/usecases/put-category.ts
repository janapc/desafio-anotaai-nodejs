import { type Catalog, type Message } from '../entities/entities'
import { type ICategoryRepository } from '../entities/repository'
import { type IStorage } from '../infra/storage/storage-interface'

export class PutCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly storage: IStorage,
  ) {}

  async execute(
    message: Message,
    catalog: Catalog,
    fileName: string,
  ): Promise<void> {
    const category = await this.categoryRepository.findById(message.id)
    const itemIndex = catalog.categories.findIndex((c) => c.id === message.id)
    if (!category) {
      catalog.categories.splice(itemIndex, 1)
    } else {
      if (itemIndex !== -1) {
        catalog.categories[itemIndex] = category
      } else {
        catalog.categories.push(category)
      }
    }
    await this.storage.putCatalog(fileName, JSON.stringify(catalog))
  }
}
