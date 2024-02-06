import { Category } from '@entities/category'
import { ProductRepositoryMock } from './mock/product-repository-mock'
import { CategoryRepositoryMock } from '@usecases/category/mock/category-repository-mock'
import { Product } from '@entities/product'
import { UpdateProductUsecase } from './UpdateProductUsecase'
import { EventMock } from './mock/event-mock'

const categoryMock = new Category('test', 'Testing', 'asd-123')

describe('Update Product Usecase', () => {
  let productRepository: ProductRepositoryMock
  let categoryRepository: CategoryRepositoryMock
  let event: EventMock
  const spies: Record<string, jest.SpyInstance> = {}

  afterEach(() => {
    jest.restoreAllMocks()
  })
  beforeEach(() => {
    productRepository = new ProductRepositoryMock()
    categoryRepository = new CategoryRepositoryMock()
    event = new EventMock()
    spies.FindByIdCategory = jest.spyOn(categoryRepository, 'findById')
    spies.UpdateProduct = jest.spyOn(productRepository, 'update')
    spies.FindByIdProduct = jest.spyOn(productRepository, 'findById')
    spies.Event = jest.spyOn(event, 'publish')
  })
  it('Should update a product', async () => {
    const c = await categoryRepository.register(categoryMock)
    const productMock = new Product(
      'test-product',
      'Testing',
      100.99,
      'asd-123',
      c,
    )
    const p = await productRepository.register(productMock)
    expect(categoryRepository.categories).toHaveLength(1)
    expect(productRepository.products).toHaveLength(1)
    const usecase = new UpdateProductUsecase(
      productRepository,
      categoryRepository,
      event,
    )
    const result = await usecase.execute({
      title: 'banana',
      id: String(p.id),
      description: 'test',
      price: 10.9,
    })
    expect(result.id).not.toBeNull()
    expect(result.category.id).not.toBeNull()
    expect(result.title).toEqual('banana')
    expect(spies.FindByIdCategory).toHaveBeenCalledTimes(0)
    expect(spies.FindByIdProduct).toHaveBeenCalledTimes(1)
    expect(spies.UpdateProduct).toHaveBeenCalledTimes(1)
    expect(spies.Event).toHaveBeenCalledTimes(1)
  })

  it('Should not update a product if category is not exists', async () => {
    expect(categoryRepository.categories).toHaveLength(0)
    expect(productRepository.products).toHaveLength(0)
    const usecase = new UpdateProductUsecase(
      productRepository,
      categoryRepository,
      event,
    )
    await expect(
      usecase.execute({
        title: 'banana',
        id: 'asd',
      }),
    ).rejects.toThrow('product is not found')
    expect(spies.FindByIdCategory).toHaveBeenCalledTimes(0)
    expect(spies.FindByIdProduct).toHaveBeenCalledTimes(1)
    expect(spies.UpdateProduct).toHaveBeenCalledTimes(0)
    expect(spies.Event).toHaveBeenCalledTimes(0)
  })

  it('Should update a product with new category', async () => {
    const oldCategory = await categoryRepository.register(categoryMock)
    const newCategory = await categoryRepository.register(categoryMock)
    const productMock = new Product(
      'test-product',
      'Testing',
      100.99,
      'asd-123',
      oldCategory,
    )
    const product = await productRepository.register(productMock)
    expect(categoryRepository.categories).toHaveLength(2)
    expect(productRepository.products).toHaveLength(1)
    const usecase = new UpdateProductUsecase(
      productRepository,
      categoryRepository,
      event,
    )
    const result = await usecase.execute({
      title: 'banana',
      category: String(newCategory.id),
      id: String(product.id),
    })
    expect(result.id).not.toBeNull()
    expect(result.category.id).not.toBeNull()
    expect(result.title).toEqual('banana')
    expect(productRepository.products[0].category.id).toEqual(
      String(newCategory.id),
    )
    expect(spies.FindByIdCategory).toHaveBeenCalledTimes(1)
    expect(spies.FindByIdProduct).toHaveBeenCalledTimes(1)
    expect(spies.UpdateProduct).toHaveBeenCalledTimes(1)
    expect(spies.Event).toHaveBeenCalledTimes(1)
  })
})
