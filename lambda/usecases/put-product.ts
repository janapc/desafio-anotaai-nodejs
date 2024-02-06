import { type Catalog, type Message } from '../entities/entities'
import { type IProductRepository } from '../entities/repository'
import { type IStorage } from '../infra/storage/storage-interface'

export class PutProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly storage: IStorage,
  ) {}

  async execute(
    message: Message,
    catalog: Catalog,
    fileName: string,
  ): Promise<void> {
    const product = await this.productRepository.findById(message.id)
    const itemIndex = catalog.products.findIndex((c) => c.id === message.id)
    if (!product) {
      catalog.products.splice(itemIndex, 1)
    } else {
      if (itemIndex !== -1) {
        catalog.products[itemIndex] = product
      } else {
        catalog.products.push(product)
      }
    }
    await this.storage.putCatalog(fileName, JSON.stringify(catalog))
  }
}
