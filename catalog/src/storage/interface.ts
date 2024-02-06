import { type Category } from '@entities/category'
import { type Product } from '@entities/product'

export interface Catalog {
  categories: Category[]
  products: Product[]
}

export interface IStorage {
  getCatalog: (fileName: string) => Promise<Catalog>
}
