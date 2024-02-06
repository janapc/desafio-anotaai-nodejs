import { type Catalog, type Message } from '../entities/entities'
import {
  type ICategoryRepository,
  type IProductRepository,
} from '../entities/repository'
import { type IStorage } from '../infra/storage/storage-interface'

export class NewStorageUseCase {
  constructor(
    private readonly storage: IStorage,
    private readonly categoryRepository: ICategoryRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(fileName: string, message: Message): Promise<void> {
    const catalog: Catalog = {
      products: [],
      categories: [],
    }
    if (message.type === 'product') {
      const product = await this.productRepository.findById(message.id)
      if (product) catalog.products.push(product)
    } else {
      const category = await this.categoryRepository.findById(message.id)
      if (category) catalog.categories.push(category)
    }
    await this.storage.putCatalog(fileName, JSON.stringify(catalog))
  }
}
