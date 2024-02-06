import { type Category } from '@entities/category'
import { Product } from '@entities/product'
import {
  type ICategoryRepository,
  type IProductRepository,
} from '@entities/repository'
import { type IEvent } from '@infra/events/interface'

export interface input {
  title: string
  description: string
  price: number
  ownerId: string
  category: string
}

interface output {
  id: string
  title: string
  description: string
  price: number
  ownerId: string
  category: Category
}

export class RegisterProductUsecase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly event: IEvent,
  ) {}

  async execute(input: input): Promise<output> {
    const category = await this.categoryRepository.findById(input.category)
    const product = new Product(
      input.title,
      input.description,
      input.price,
      input.ownerId,
      category,
    )
    const result = await this.productRepository.register(product)

    const output = {
      id: String(result.id),
      title: result.title,
      description: result.description,
      price: result.price,
      ownerId: result.ownerId,
      category: result.category,
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
