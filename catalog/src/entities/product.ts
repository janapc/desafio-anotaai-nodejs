import { type Category } from './category'

export class Product {
  id?: string
  title: string
  description: string
  price: number
  category: Category
  ownerId: string

  constructor(
    title: string,
    description: string,
    price: number,
    ownerId: string,
    category: Category,
  ) {
    this.title = title
    this.description = description
    this.price = price
    this.ownerId = ownerId
    this.category = category
    this._valid()
  }

  _valid(): void {
    const fields = []
    if (!this.description || this.description === '') fields.push('description')
    if (!this.title || this.title === '') fields.push('title')
    if (!this.price) fields.push('price')
    if (!this.ownerId || this.ownerId === '') fields.push('ownerId')
    if (!this.category) fields.push('category')
    if (fields.length > 0) {
      const msg = `these field are required: ${fields.join(',')}`
      throw new Error(msg)
    }
  }
}
