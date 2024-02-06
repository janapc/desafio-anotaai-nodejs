import { GetAllCategoryUsecase } from './GetAllCategoryUsecase'
import { StorageMock } from './mock/storage-mock'

describe('Get All Category Usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('Should return all categories', async () => {
    const storage = new StorageMock()
    const spyStorage = jest.spyOn(storage, 'getCatalog')
    const usecase = new GetAllCategoryUsecase(storage)
    const result = await usecase.execute('test.json')
    expect(result).toHaveLength(1)
    expect(result[0].title).toEqual('test')
    expect(spyStorage).toHaveBeenCalledTimes(1)
  })
})
