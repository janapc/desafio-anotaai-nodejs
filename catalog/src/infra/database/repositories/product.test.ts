import { MongoDbProductRepository } from './product'
import { Category } from '@entities/category'
import { productModel } from '../schemas/product'
import { Product } from '@entities/product'

afterEach(() => {
  jest.restoreAllMocks()
})

const mockData = (product: Product, category: Category): any => ({
  id: product.id,
  title: product.title,
  description: product.description,
  ownerId: product.ownerId,
  price: product.price,
  category: {
    id: category.id,
    title: category.title,
    description: category.description,
    ownerId: category.ownerId,
  },
})

const errorDatabase = new Error('database is disconnected')

describe('Product Repository', () => {
  it('Should create a new product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel.prototype, 'save')
      .mockResolvedValue(mockData(product, category))
    const repository = new MongoDbProductRepository(productModel)
    const result = await repository.register(product)
    expect(result.id).toEqual('asd')
    expect(result.category.id).toEqual('123')
    expect(productModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should not create a product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel.prototype, 'save')
      .mockRejectedValue(errorDatabase)
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.register(product)).rejects.toThrow(errorDatabase)
    expect(productModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should update a product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'findByIdAndUpdate')
      .mockResolvedValue(mockData(product, category))
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.update(product)).resolves.toBeUndefined()
    expect(productModelSpy).toHaveBeenCalledTimes(1)
    expect(productModelSpy).toHaveBeenCalledWith(product.id, product)
  })

  it('Should not update a product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'findByIdAndUpdate')
      .mockRejectedValue(errorDatabase)
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.update(product)).rejects.toThrow(errorDatabase)
    expect(productModelSpy).toHaveBeenCalledTimes(1)
    expect(productModelSpy).toHaveBeenCalledWith(product.id, product)
  })

  it('Should return all products in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'find')
      .mockImplementation((): any => {
        return {
          populate: jest.fn().mockResolvedValue([mockData(product, category)]),
        }
      })
    const repository = new MongoDbProductRepository(productModel)
    const result = await repository.all()
    expect(result[0].id).toEqual('asd')
    expect(productModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should not return products in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'find')
      .mockImplementation((): any => {
        return {
          populate: jest.fn().mockRejectedValue(errorDatabase),
        }
      })
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.all()).rejects.toThrow(errorDatabase)
    expect(productModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return a product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'findById')
      .mockImplementation((): any => {
        return {
          populate: jest.fn().mockResolvedValue(mockData(product, category)),
        }
      })
    const repository = new MongoDbProductRepository(productModel)
    const result = await repository.findById(product.id)
    expect(result.id).toEqual('asd')
    expect(productModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return error if not found product in the database', async () => {
    const productModelSpy = jest
      .spyOn(productModel, 'findById')
      .mockImplementation((): any => {
        return {
          populate: jest.fn().mockResolvedValue(null),
        }
      })
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.findById('asd')).rejects.toThrow(
      new Error('product is not found'),
    )
    expect(productModelSpy).toHaveBeenCalledTimes(1)
  })

  it('Should not return a product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'findById')
      .mockImplementation((): any => {
        return {
          populate: jest.fn().mockRejectedValue(errorDatabase),
        }
      })
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.findById(product.id)).rejects.toThrow(errorDatabase)
    expect(productModelSpy).toHaveBeenCalledTimes(1)
    expect(productModelSpy).toHaveBeenCalledWith(product.id)
  })

  it('Should delete a product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'findByIdAndDelete')
      .mockResolvedValue('')
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.delete(product.id)).resolves.toBeUndefined()
    expect(productModelSpy).toHaveBeenCalledTimes(1)
    expect(productModelSpy).toHaveBeenCalledWith({ _id: product.id })
  })

  it('Should not delete a product in the database', async () => {
    const category = new Category('test', 'Testing', '123')
    category.id = '123'
    const product = new Product('test 1', 'Testing 1', 10.99, '123', category)
    product.id = 'asd'
    const productModelSpy = jest
      .spyOn(productModel, 'findByIdAndDelete')
      .mockRejectedValue(errorDatabase)
    const repository = new MongoDbProductRepository(productModel)
    await expect(repository.delete(product.id)).rejects.toThrow(errorDatabase)
    expect(productModelSpy).toHaveBeenCalledTimes(1)
    expect(productModelSpy).toHaveBeenCalledWith({ _id: product.id })
  })
})
