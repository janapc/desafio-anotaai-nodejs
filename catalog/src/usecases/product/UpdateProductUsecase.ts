import { type Category } from '@entities/category'
import {
  type IProductRepository,
  type ICategoryRepository,
} from '@entities/repository'
import { type IEvent } from '@infra/events/interface'

export interface input {
  id: string
  title?: string
  description?: string
  price?: number
  category?: string
}

interface output {
  id: string
  title: string
  description: string
  ownerId: string
  price: number
  category: Category
}

export class UpdateProductUsecase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly event: IEvent,
  ) {}

  async execute(input: input): Promise<output> {
    let category!: Category
    if (input.category) {
      category = await this.categoryRepository.findById(input.category)
    }
    const product = await this.productRepository.findById(input.id)
    if (input.title) product.title = input.title
    if (input.description) product.description = input.description
    if (input.price) product.price = input.price
    if (input.category) product.category = category

    await this.productRepository.update(product)

    const output = {
      id: String(product.id),
      title: product.title,
      description: product.description,
      price: product.price,
      ownerId: product.ownerId,
      category: product.category,
    }

    await this.event.publish(
      JSON.stringify({
        ownerId: output.ownerId,
        id: output.id,
        type: 'product',
      }),
    )
    return output
  }
}
