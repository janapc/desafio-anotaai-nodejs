import { Product } from './product'
import { Category } from './category'

describe('Product Entity', () => {
  it('Should create a new Product', async () => {
    const category = new Category(
      'test-category',
      'testing category',
      'test123',
    )
    const product = new Product(
      'test-product',
      'testing product',
      10.99,
      'test123',
      category,
    )
    expect(product.title).toEqual('test-product')
    expect(product.description).toEqual('testing product')
    expect(product.price).toEqual(10.99)
    expect(product.ownerId).toEqual('test123')
    expect(product.category).toEqual(category)
    expect(product.id).toBeFalsy()
  })

  it('Should not create a new Product', () => {
    const category = new Category(
      'test-category',
      'testing category',
      'test123',
    )
    expect(() => new Product('', '', 0, '', category)).toThrow(
      new Error('these field are required: description,title,price,ownerId'),
    )
  })
})
