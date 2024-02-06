import { GetAllProductUsecase } from './GetAllProductUsecase'
import { StorageMock } from './mock/storage-mock'

describe('Get All Product Usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('Should return all products', async () => {
    const storage = new StorageMock()
    const spyStorage = jest.spyOn(storage, 'getCatalog')
    const usecase = new GetAllProductUsecase(storage)
    const result = await usecase.execute('test.json')
    expect(result).toHaveLength(1)
    expect(result[0].title).toEqual('testing')
    expect(result[0].category.id).not.toBeNull()
    expect(result[0].id).not.toBeNull()
    expect(spyStorage).toHaveBeenCalledTimes(1)
  })
})
