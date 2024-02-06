import { MongoDbCategoryRepository } from './category'
import { categoryModel } from '../schemas/category'
import { Category } from '@entities/category'

afterEach(() => {
  jest.restoreAllMocks()
})

const mockData = (category: Category): any => ({
  id: category.id,
  title: category.title,
  description: category.description,
  ownerId: category.ownerId,
})

const errorDatabase = new Error('database is disconnected')

const categoryMock = (): Category => {
  const category = new Category('test', 'Testing', '123')
  category.id = '123'
  return category
}

describe('Category Repository', () => {
  it('Should create a new category', async () => {
    const category = new Category('test', 'Testing', '123')
    const mockCategory = new Category('test', 'Testing', '123')
    mockCategory.id = 'asd123'
    const categoryModelSpy = jest
      .spyOn(categoryModel.prototype, 'save')
      .mockResolvedValue(mockData(mockCategory))
    const repository = new MongoDbCategoryRepository(categoryModel)
    const result = await repository.register(category)
    expect(result.id).toEqual('asd123')
    expect(result.title).toEqual('test')
    expect(result.description).toEqual('Testing')
    expect(result.ownerId).toEqual('123')
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should not create a category', async () => {
    const categoryModelSpy = jest
      .spyOn(categoryModel.prototype, 'save')
      .mockRejectedValue(errorDatabase)
    const category = new Category('test', 'Testing', '123')
    const repository = new MongoDbCategoryRepository(categoryModel)
    await expect(repository.register(category)).rejects.toThrow(errorDatabase)
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should update a category', async () => {
    const category = categoryMock()
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'findByIdAndUpdate')
      .mockResolvedValue(mockData(category))
    const repository = new MongoDbCategoryRepository(categoryModel)
    await expect(repository.update(category)).resolves.toBeUndefined()
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
    expect(categoryModelSpy).toHaveBeenCalledWith(category.id, category)
  })

  it('Should not update a category', async () => {
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'findByIdAndUpdate')
      .mockRejectedValue(errorDatabase)
    const category = categoryMock()
    const repository = new MongoDbCategoryRepository(categoryModel)
    await expect(repository.update(category)).rejects.toThrow(errorDatabase)
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
    expect(categoryModelSpy).toHaveBeenCalledWith(category.id, category)
  })

  it('Should delete a category by id', async () => {
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'findByIdAndDelete')
      .mockResolvedValue('')
    const id = '123'
    const repository = new MongoDbCategoryRepository(categoryModel)
    await expect(repository.delete(id)).resolves.toBeUndefined()
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
    expect(categoryModelSpy).toHaveBeenCalledWith({ _id: id })
  })

  it('Should not delete a category', async () => {
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'findByIdAndDelete')
      .mockRejectedValue(errorDatabase)
    const id = '123'
    const repository = new MongoDbCategoryRepository(categoryModel)
    await expect(repository.delete(id)).rejects.toThrow(errorDatabase)
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
    expect(categoryModelSpy).toHaveBeenCalledWith({ _id: id })
  })

  it('Should return all categories', async () => {
    const category = categoryMock()
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'find')
      .mockResolvedValue([mockData(category)])
    const repository = new MongoDbCategoryRepository(categoryModel)
    const result = await repository.all()
    expect(result).toHaveLength(1)
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should not return all categories', async () => {
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'find')
      .mockRejectedValue(errorDatabase)
    const repository = new MongoDbCategoryRepository(categoryModel)
    await expect(repository.all()).rejects.toThrow(errorDatabase)
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return a category', async () => {
    const category = categoryMock()
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'findById')
      .mockResolvedValue(mockData(category))
    const repository = new MongoDbCategoryRepository(categoryModel)
    const result = await repository.findById('123')
    expect(result).toEqual(mockData(category))
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should not return a category', async () => {
    const categoryModelSpy = jest
      .spyOn(categoryModel, 'findById')
      .mockResolvedValue(null)
    const repository = new MongoDbCategoryRepository(categoryModel)
    await expect(repository.findById('123')).rejects.toThrow(
      'category is not found',
    )
    expect(categoryModelSpy).toHaveBeenCalledTimes(1)
  })
})
