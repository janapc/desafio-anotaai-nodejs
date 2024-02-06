import { type ICategoryRepository } from '@entities/repository'
import { type IEvent } from '@infra/events/interface'

export class DeleteCategoryUsecase {
  constructor(
    private readonly categoryRepostory: ICategoryRepository,
    private readonly event: IEvent,
  ) {}

  async execute(categoryId: string, ownerId: string): Promise<void> {
    const category = await this.categoryRepostory.findById(categoryId)
    if (category.ownerId !== ownerId) {
      throw new Error('the field owner is wrong')
    }
    await this.categoryRepostory.delete(categoryId)
    await this.event.publish(
      JSON.stringify({
        ownerId,
        id: categoryId,
        type: 'category',
      }),
    )
  }
}
