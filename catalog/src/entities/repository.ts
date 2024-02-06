import { type Category } from './category'
import { type Product } from './product'

export interface ICategoryRepository {
  register: (category: Category) => Promise<Category>
  update: (category: Category) => Promise<void>
  findById: (id: string) => Promise<Category>
  delete: (id: string) => Promise<void>
  all: () => Promise<Category[]>
}

export interface IProductRepository {
  register: (product: Product) => Promise<Product>
  update: (product: Product) => Promise<void>
  findById: (id: string) => Promise<Product>
  delete: (id: string) => Promise<void>
  all: () => Promise<Product[]>
}
