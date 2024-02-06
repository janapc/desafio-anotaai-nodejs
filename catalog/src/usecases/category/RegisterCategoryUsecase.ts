import { Category } from '@entities/category'
import { type ICategoryRepository } from '@entities/repository'
import { type IEvent } from '@infra/events/interface'

export interface input {
  title: string
  description: string
  ownerId: string
}

interface output {
  id: string
  title: string
  description: string
  ownerId: string
}

export class RegisterCategoryUsecase {
  constructor(
    private readonly categoryRepostory: ICategoryRepository,
    private readonly event: IEvent,
  ) {}

  async execute(input: input): Promise<output> {
    const category = new Category(input.title, input.description, input.ownerId)
    const result = await this.categoryRepostory.register(category)
    const output = {
      id: String(result.id),
      title: result.title,
      description: result.description,
      ownerId: result.ownerId,
    }
    await this.event.publish(
      JSON.stringify({
        ownerId: output.ownerId,
        id: output.id,
        type: 'category',
      }),
    )
    return output
  }
}
