import { Category } from '@entities/category'
import { Product } from '@entities/product'
import { ProductRepositoryMock } from './mock/product-repository-mock'
import { DeleteProductUsecase } from './DeleteProductUsecase'
import { EventMock } from './mock/event-mock'

const categoryMock = new Category('test', 'Testing', 'asd-123')

describe('Delete Product Usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('Should delete a product', async () => {
    const productMock = new Product(
      'test-product',
      'Testing',
      10.99,
      'asd-123',
      categoryMock,
    )
    const repository = new ProductRepositoryMock()
    const event = new EventMock()
    const p = await repository.register(productMock)
    const spyFindById = jest.spyOn(repository, 'findById')
    const spyDelete = jest.spyOn(repository, 'delete')
    const spyEvent = jest.spyOn(event, 'publish')
    expect(repository.products).toHaveLength(1)
    const usecase = new DeleteProductUsecase(repository, event)
    await expect(
      usecase.execute(String(p.id), String(p.ownerId)),
    ).resolves.toBeUndefined()
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(spyEvent).toHaveBeenCalledTimes(1)
    expect(repository.products).toHaveLength(0)
  })

  it('Should not delete a product if it is not found', async () => {
    const repository = new ProductRepositoryMock()
    const event = new EventMock()
    const spyFindById = jest.spyOn(repository, 'findById')
    const spyDelete = jest.spyOn(repository, 'delete')
    expect(repository.products).toHaveLength(0)
    const usecase = new DeleteProductUsecase(repository, event)
    const id = 'asd'
    await expect(usecase.execute(id, '123')).rejects.toThrow(
      new Error('product is not found'),
    )
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledTimes(0)
  })

  it('Should not delete a product if ownerId is different', async () => {
    const productMock = new Product(
      'test-product',
      'Testing',
      10.99,
      'asd-123',
      categoryMock,
    )
    const repository = new ProductRepositoryMock()
    const event = new EventMock()
    const p = await repository.register(productMock)
    const spyFindById = jest.spyOn(repository, 'findById')
    const spyDelete = jest.spyOn(repository, 'delete')
    expect(repository.products).toHaveLength(1)
    const usecase = new DeleteProductUsecase(repository, event)
    await expect(usecase.execute(String(p.id), 'test')).rejects.toThrow(
      'the field owner is wrong',
    )
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledTimes(0)
  })
})
