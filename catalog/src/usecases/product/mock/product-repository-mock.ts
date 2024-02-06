import { type IProductRepository } from '@entities/repository'
import { type Product } from '@entities/product'

export class ProductRepositoryMock implements IProductRepository {
  public products: Product[] = []
  async register(product: Product): Promise<Product> {
    product.id = 'test-' + Date()
    this.products.push(product)
    return product
  }

  async update(product: Product): Promise<void> {
    const productIndex = this.products.findIndex(
      (item) => item.id === product.id,
    )
    if (productIndex >= 0) {
      this.products[productIndex] = product
    }
  }

  async findById(id: string): Promise<Product> {
    const product = this.products.find((c) => c.id === id)
    if (!product) {
      throw new Error('product is not found')
    }
    return product
  }

  async delete(id: string): Promise<void> {
    const productIndex = this.products.findIndex((item) => item.id === id)
    this.products.splice(productIndex, 1)
  }

  async all(): Promise<Product[]> {
    return this.products
  }
}
