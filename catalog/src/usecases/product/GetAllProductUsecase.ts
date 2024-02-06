import { type Category } from '@entities/category'
import { type IStorage } from 'storage/interface'

interface output {
  id: string
  title: string
  description: string
  ownerId: string
  price: number
  category: Category
}

export class GetAllProductUsecase {
  constructor(private readonly storage: IStorage) {}

  async execute(ownerId: string): Promise<output[]> {
    const fileName = `${ownerId}-catalog.json`
    const catalog = await this.storage.getCatalog(fileName)
    return catalog.products.map((product) => {
      const findCategory = catalog.categories.find(
        (item) => String(item.id) === String(product.category),
      )
      return {
        id: String(product.id),
        title: product.title,
        description: product.description,
        price: product.price,
        ownerId: product.ownerId,
        category: findCategory ?? product.category,
      }
    })
  }
}
