import { Category } from '@entities/category'
import { CategoryRepositoryMock } from './mock/category-repository-mock'
import { UpdateCategoryUsecase } from './UpdateCategoryUsecase'
import { EventMock } from './mock/event-mock'

const categoryMock = new Category('test', 'Testing', 'asd-123')

describe('Update Category Usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('Should update a category', async () => {
    const repository = new CategoryRepositoryMock()
    const event = new EventMock()
    const spyUpdate = jest.spyOn(repository, 'update')
    const spyFind = jest.spyOn(repository, 'findById')
    const spyEvent = jest.spyOn(event, 'publish')
    const c = await repository.register(categoryMock)
    const usecase = new UpdateCategoryUsecase(repository, event)
    await usecase.execute({
      id: String(c.id),
      title: 'test update',
      description: 'test update',
    })
    const findCategory = repository.categories.find((item) => item.id === c.id)
    expect(findCategory?.title).toEqual('test update')
    expect(spyFind).toHaveBeenCalledTimes(1)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(spyEvent).toHaveBeenCalledTimes(1)
    expect(repository.categories).toHaveLength(1)
  })
})
