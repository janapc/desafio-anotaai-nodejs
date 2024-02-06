import { Category } from './category'

describe('Category Entity', () => {
  it('Should create a new Category', () => {
    const category = new Category('test', 'testing', 'test123')
    expect(category.title).toEqual('test')
    expect(category.description).toEqual('testing')
    expect(category.ownerId).toEqual('test123')
    expect(category.id).toBeFalsy()
  })

  it('Should not create a new Category', () => {
    expect(() => new Category('', '', '')).toThrow(
      new Error('these field are required: description,title,ownerId'),
    )
  })
})
