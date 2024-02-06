import { Category } from '@entities/category'
import { ProductRepositoryMock } from './mock/product-repository-mock'
import { RegisterProductUsecase } from './RegisterProductUsecase'
import { CategoryRepositoryMock } from '@usecases/category/mock/category-repository-mock'
import { EventMock } from './mock/event-mock'

const categoryMock = new Category('test', 'Testing', 'asd-123')

describe('Register Product Usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('Should register a product', async () => {
    const productRepository = new ProductRepositoryMock()
    const categoryRepository = new CategoryRepositoryMock()
    const event = new EventMock()
    const spyFindById = jest.spyOn(categoryRepository, 'findById')
    const spyRegister = jest.spyOn(productRepository, 'register')
    const spyEvent = jest.spyOn(event, 'publish')
    const c = await categoryRepository.register(categoryMock)
    expect(categoryRepository.categories).toHaveLength(1)
    const usecase = new RegisterProductUsecase(
      productRepository,
      categoryRepository,
      event,
    )
    const result = await usecase.execute({
      title: 'test-product',
      description: 'Testing',
      price: 100.99,
      ownerId: 'asd-123',
      category: String(c.id),
    })
    expect(result.id).not.toBeNull()
    expect(result.category.id).not.toBeNull()
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(spyFindById).toHaveBeenCalledWith(String(c.id))
    expect(spyRegister).toHaveBeenCalledTimes(1)
    expect(spyEvent).toHaveBeenCalledTimes(1)
    expect(event.messages).toHaveLength(1)
  })

  it('Should not register a product if category is not exists', async () => {
    const productRepository = new ProductRepositoryMock()
    const categoryRepository = new CategoryRepositoryMock()
    const event = new EventMock()
    const spyFindById = jest.spyOn(categoryRepository, 'findById')
    const spyRegister = jest.spyOn(productRepository, 'register')
    const spyEvent = jest.spyOn(event, 'publish')
    expect(categoryRepository.categories).toHaveLength(0)
    const usecase = new RegisterProductUsecase(
      productRepository,
      categoryRepository,
      event,
    )
    await expect(
      usecase.execute({
        title: 'test-product',
        description: 'Testing',
        price: 100.99,
        ownerId: 'asd-123',
        category: 'asd',
      }),
    ).rejects.toThrow('category is not found')
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(spyFindById).toHaveBeenCalledWith('asd')
    expect(spyRegister).toHaveBeenCalledTimes(0)
    expect(spyEvent).toHaveBeenCalledTimes(0)
  })
})
