import { CategoryRepositoryMock } from './mock/category-repository-mock'
import { EventMock } from './mock/event-mock'
import { RegisterCategoryUsecase } from './RegisterCategoryUsecase'

describe('Register Category Usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('Should register a category', async () => {
    const repository = new CategoryRepositoryMock()
    const event = new EventMock()
    const spyRegister = jest.spyOn(repository, 'register')
    const spyEvent = jest.spyOn(event, 'publish')
    const usecase = new RegisterCategoryUsecase(repository, event)
    const result = await usecase.execute({
      title: 'test',
      description: 'testing',
      ownerId: 'asd-123',
    })
    expect(result.id).not.toBeNull()
    expect(result.title).toEqual('test')
    expect(spyRegister).toHaveBeenCalledTimes(1)
    expect(spyEvent).toHaveBeenCalledTimes(1)
    expect(repository.categories).toHaveLength(1)
  })
})
