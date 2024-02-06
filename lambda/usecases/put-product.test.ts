import { type IStorage } from '../infra/storage/storage-interface'
import { type IProductRepository } from '../entities/repository'
import { PutProductUseCase } from './put-product'

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

const storageMock: IStorage = {
  putCatalog: jest.fn().mockResolvedValue(true),
  getCatalog: jest.fn().mockResolvedValue(true),
}

describe('Put Product Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Should insert a new product in catalog', async () => {
    const spyProduct = jest.spyOn(productRepositoryMock, 'findById')
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new PutProductUseCase(productRepositoryMock, storageMock)
    await usecase.execute(
      {
        id: 'asd',
        ownerId: 'test',
        type: 'product',
      },
      { products: [], categories: [] },
      'test.json',
    )

    expect(spyProduct).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'test.json',
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

  it('Should put a product in catalog', async () => {
    const spyProduct = jest.spyOn(productRepositoryMock, 'findById')
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new PutProductUseCase(productRepositoryMock, storageMock)
    await usecase.execute(
      {
        id: 'test',
        ownerId: 'test',
        type: 'product',
      },
      {
        products: [
          {
            id: 'test',
            title: 'test 1',
            description: 'test 1',
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
      },
      'test.json',
    )

    expect(spyProduct).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'test.json',
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

  it('Should delete a product in catalog', async () => {
    const spyProduct = jest
      .spyOn(productRepositoryMock, 'findById')
      .mockResolvedValue(null)
    const spyStorage = jest.spyOn(storageMock, 'putCatalog')
    const usecase = new PutProductUseCase(productRepositoryMock, storageMock)
    await usecase.execute(
      {
        id: 'test',
        ownerId: 'test',
        type: 'product',
      },
      {
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
          {
            id: 'test 2',
            title: 'test 2',
            description: 'test 2',
            ownerId: 'test 2',
            price: 10.9,
            category: {
              id: 'test 2',
              title: 'test 2',
              description: 'test 2',
              ownerId: 'test 2',
            },
          },
        ],
        categories: [],
      },
      'test.json',
    )

    expect(spyProduct).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledTimes(1)
    expect(spyStorage).toHaveBeenCalledWith(
      'test.json',
      JSON.stringify({
        products: [
          {
            id: 'test 2',
            title: 'test 2',
            description: 'test 2',
            ownerId: 'test 2',
            price: 10.9,
            category: {
              id: 'test 2',
              title: 'test 2',
              description: 'test 2',
              ownerId: 'test 2',
            },
          },
        ],
        categories: [],
      }),
    )
  })
})
