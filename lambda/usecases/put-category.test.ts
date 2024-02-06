import { type IStorage } from '../infra/storage/storage-interface'
import { type ICategoryRepository } from '../entities/repository'
import { PutCategoryUseCase } from './put-category'

const categoryRepositoryMock: ICategoryRepository = {
  findById: jest.fn().mockResolvedValue({
    id: 'test',
    title: 'test',
    description: 'test',
    ownerId: 'test',
  }),
}

const storageMock: IStorage = {
  putCatalog: jest.fn().mockResolvedValue(true),
  getCatalog: jest.fn().mockResolvedValue(true),
}

describe('Put Category Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Should insert a new category in catalog', async () => {
    const spyCatagory = jest.spyOn(categoryRepositoryMock, 'findById')
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new PutCategoryUseCase(categoryRepositoryMock, storageMock)
    await usecase.execute(
      {
        id: 'asd',
        ownerId: 'test',
        type: 'category',
      },
      { products: [], categories: [] },
      'test.json',
    )

    expect(spyCatagory).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'test.json',
      JSON.stringify({
        products: [],
        categories: [
          {
            id: 'test',
            title: 'test',
            description: 'test',
            ownerId: 'test',
          },
        ],
      }),
    )
  })

  it('Should put a category in catalog', async () => {
    const spyCatagory = jest.spyOn(categoryRepositoryMock, 'findById')
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new PutCategoryUseCase(categoryRepositoryMock, storageMock)
    await usecase.execute(
      {
        id: 'test',
        ownerId: 'test',
        type: 'category',
      },
      {
        products: [],
        categories: [
          {
            id: 'test',
            title: 'test 3',
            description: 'test 3',
            ownerId: 'test',
          },
        ],
      },
      'test.json',
    )

    expect(spyCatagory).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'test.json',
      JSON.stringify({
        products: [],
        categories: [
          {
            id: 'test',
            title: 'test',
            description: 'test',
            ownerId: 'test',
          },
        ],
      }),
    )
  })

  it('Should delete a category in catalog', async () => {
    const spyCatagory = jest
      .spyOn(categoryRepositoryMock, 'findById')
      .mockResolvedValue(null)
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new PutCategoryUseCase(categoryRepositoryMock, storageMock)
    await usecase.execute(
      {
        id: 'test',
        ownerId: 'test',
        type: 'category',
      },
      {
        products: [],
        categories: [
          {
            id: 'test',
            title: 'test',
            description: 'test',
            ownerId: 'test',
          },
          {
            id: 'test1',
            title: 'test 1',
            description: 'test 1',
            ownerId: 'test 1',
          },
        ],
      },
      'test.json',
    )

    expect(spyCatagory).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'test.json',
      JSON.stringify({
        products: [],
        categories: [
          {
            id: 'test1',
            title: 'test 1',
            description: 'test 1',
            ownerId: 'test 1',
          },
        ],
      }),
    )
  })
})
