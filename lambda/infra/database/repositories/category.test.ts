import { MongoDbCategoryRepository } from './category'
import { categoryModel } from '../schemas/category'
import { type Category } from '../../../entities/entities'

const mockData = (category: Category): any => ({
  _id: category.id,
  title: category.title,
  description: category.description,
  ownerId: category.ownerId,
})

const categoryMock = (): Category => {
  return {
    id: 'test',
    title: 'test',
    description: 'test',
    ownerId: 'test',
  }
}

describe('Category Repository', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Should return a category', async () => {
    const category = categoryMock()
    const spyFindById = jest
      .spyOn(categoryModel, 'findById')
      .mockResolvedValue(mockData(category))
    const repository = new MongoDbCategoryRepository(categoryModel)
    const result = await repository.findById('123')
    expect(result).toEqual(category)
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('Should return null if a category is not found', async () => {
    const spyFindById = jest
      .spyOn(categoryModel, 'findById')
      .mockResolvedValue(null)
    const repository = new MongoDbCategoryRepository(categoryModel)
    const result = await repository.findById('123')
    expect(result).toBeNull()
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })
})
