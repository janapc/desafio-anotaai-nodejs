export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: Category | string
  ownerId: string
}

export interface Category {
  id: string
  title: string
  description: string
  ownerId: string
}

export interface Message {
  id: string
  ownerId: string
  type: string
}

export interface Catalog {
  products: Product[]
  categories: Category[]
}
