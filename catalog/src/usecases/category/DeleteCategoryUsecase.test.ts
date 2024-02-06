import { Category } from '@entities/category'
import { CategoryRepositoryMock } from './mock/category-repository-mock'
import { DeleteCategoryUsecase } from './DeleteCategoryUsecase'
import { EventMock } from './mock/event-mock'

const categoryMock = new Category('test', 'Testing', 'asd-123')

describe('Delete Category Usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('Should delete a category', async () => {
    const repository = new CategoryRepositoryMock()
    const event = new EventMock()
    const spyDelete = jest.spyOn(repository, 'delete')
    const spyFind = jest.spyOn(repository, 'findById')
    const spyEvent = jest.spyOn(event, 'publish')
    const c = await repository.register(categoryMock)
    expect(repository.categories).toHaveLength(1)
    const usecase = new DeleteCategoryUsecase(repository, event)
    await expect(
      usecase.execute(String(c.id), String(c.ownerId)),
    ).resolves.toBeUndefined()
    expect(spyFind).toHaveBeenCalledTimes(1)
    expect(spyFind).toHaveBeenCalledWith(String(c.id))
    expect(repository.categories).toHaveLength(0)
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(spyEvent).toHaveBeenCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledWith(String(c.id))
  })

  it('Should not delete a category if category is not found', async () => {
    const repository = new CategoryRepositoryMock()
    expect(repository.categories).toHaveLength(0)
    const event = new EventMock()
    const spyDelete = jest.spyOn(repository, 'delete')
    const spyFind = jest.spyOn(repository, 'findById')
    const spyEvent = jest.spyOn(event, 'publish')
    const usecase = new DeleteCategoryUsecase(repository, event)
    await expect(usecase.execute('asd-123', '123')).rejects.toThrow(
      'category is not found',
    )
    expect(spyFind).toHaveBeenCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledTimes(0)
    expect(spyEvent).toHaveBeenCalledTimes(0)
  })

  it('Should not delete a category if ownerId is different', async () => {
    const repository = new CategoryRepositoryMock()
    const c = await repository.register(categoryMock)
    const event = new EventMock()
    const spyDelete = jest.spyOn(repository, 'delete')
    const spyFind = jest.spyOn(repository, 'findById')
    const spyEvent = jest.spyOn(event, 'publish')
    const usecase = new DeleteCategoryUsecase(repository, event)
    await expect(usecase.execute(String(c.id), 'test')).rejects.toThrow(
      'the field owner is wrong',
    )
    expect(spyFind).toHaveBeenCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledTimes(0)
    expect(spyEvent).toHaveBeenCalledTimes(0)
  })
})
