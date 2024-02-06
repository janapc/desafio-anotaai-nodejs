import { type Category, type Product } from './entities'

export interface ICategoryRepository {
  findById: (id: string) => Promise<Category | null>
}

export interface IProductRepository {
  findById: (id: string) => Promise<Product | null>
}
