import { type IStorage } from 'storage/interface'

interface output {
  id: string
  title: string
  description: string
  ownerId: string
}

export class GetAllCategoryUsecase {
  constructor(private readonly storage: IStorage) {}

  async execute(ownerId: string): Promise<output[]> {
    const fileName = `${ownerId}-catalog.json`
    const catalog = await this.storage.getCatalog(fileName)
    return catalog.categories.map((category) => ({
      id: String(category.id),
      title: category.title,
      description: category.description,
      ownerId: category.ownerId,
    }))
  }
}
