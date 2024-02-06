import { type IProductRepository } from '@entities/repository'
import { type IEvent } from '@infra/events/interface'

export class DeleteProductUsecase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly event: IEvent,
  ) {}

  async execute(productId: string, ownerId: string): Promise<void> {
    const product = await this.productRepository.findById(productId)
    if (product.ownerId !== ownerId) {
      throw new Error('the field owner is wrong')
    }
    await this.productRepository.delete(productId)
    await this.event.publish(
      JSON.stringify({ ownerId, id: productId, type: 'product' }),
    )
  }
}
