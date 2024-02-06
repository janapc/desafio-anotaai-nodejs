import { NewStorageUseCase } from './new-storage'
import { type IStorage } from '../infra/storage/storage-interface'
import {
  type IProductRepository,
  type ICategoryRepository,
} from '../entities/repository'

const productRepositoryMock: IProductRepository = {
  findById: jest.fn().mockResolvedValue({
    id: 'test',
    title: 'test',
    description: 'test',
    ownerId: 'test',
    price: 10.9,
    category: {
      id: 'test',
      title: 'test',
      description: 'test',
      ownerId: 'test',
    },
  }),
}

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

describe('New Storage Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Should create catalog with products', async () => {
    const spyCatagory = jest.spyOn(categoryRepositoryMock, 'findById')
    const spyProduct = jest.spyOn(productRepositoryMock, 'findById')
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new NewStorageUseCase(
      storageMock,
      categoryRepositoryMock,
      productRepositoryMock,
    )
    await usecase.execute('Test.json', {
      id: 'test',
      ownerId: 'test',
      type: 'product',
    })

    expect(spyCatagory).toHaveBeenCalledTimes(0)
    expect(spyProduct).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'Test.json',
      JSON.stringify({
        products: [
          {
            id: 'test',
            title: 'test',
            description: 'test',
            ownerId: 'test',
            price: 10.9,
            category: {
              id: 'test',
              title: 'test',
              description: 'test',
              ownerId: 'test',
            },
          },
        ],
        categories: [],
      }),
    )
  })

  it('Should create catalog with category', async () => {
    const spyCatagory = jest.spyOn(categoryRepositoryMock, 'findById')
    const spyProduct = jest.spyOn(productRepositoryMock, 'findById')
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new NewStorageUseCase(
      storageMock,
      categoryRepositoryMock,
      productRepositoryMock,
    )
    await usecase.execute('Test.json', {
      id: 'test',
      ownerId: 'test',
      type: 'category',
    })

    expect(spyCatagory).toHaveBeenCalledTimes(1)
    expect(spyProduct).toHaveBeenCalledTimes(0)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'Test.json',
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
})
