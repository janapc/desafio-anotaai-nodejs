import { MongoDbProductRepository } from './product'
import { type Category } from '../../../entities/entities'
import { productModel } from '../schemas/product'

const mockCategory: Category = {
  id: 'test',
  title: 'test',
  description: 'test',
  ownerId: 'test',
}

describe('Product Repository', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Should return a product', async () => {
    const product = {
      id: 'testing',
      title: 'testing',
      description: 'testing',
      price: 10.0,
      category: mockCategory,
      ownerId: 'testing',
    }
    const spyFindById = jest
      .spyOn(productModel, 'findById')
      .mockResolvedValue({ ...product, category: mockCategory.id })
    const repository = new MongoDbProductRepository(productModel)
    const result = await repository.findById(product.id)
    expect(result).not.toBeNull()
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('Should return null if a product not found', async () => {
    const spyFindById = jest
      .spyOn(productModel, 'findById')
      .mockResolvedValue(null)
    const repository = new MongoDbProductRepository(productModel)
    const result = await repository.findById('asd')
    expect(result).toBeNull()
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })
})
