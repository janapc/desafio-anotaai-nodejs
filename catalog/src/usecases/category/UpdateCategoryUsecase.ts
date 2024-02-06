import { type ICategoryRepository } from '@entities/repository'
import { type IEvent } from '@infra/events/interface'

export interface input {
  id: string
  title?: string
  description?: string
}

interface output {
  id: string
  title: string
  description: string
  ownerId: string
}

export class UpdateCategoryUsecase {
  constructor(
    private readonly categoryRepostory: ICategoryRepository,
    private readonly event: IEvent,
  ) {}

  async execute(input: input): Promise<output> {
    const category = await this.categoryRepostory.findById(input.id)
    if (input.title) category.title = input.title
    if (input.description) category.description = input.description
    await this.categoryRepostory.update(category)
    const output = {
      id: String(category.id),
      title: category.title,
      description: category.description,
      ownerId: category.ownerId,
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
