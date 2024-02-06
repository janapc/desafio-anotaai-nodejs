import { type Catalog, type IStorage } from 'storage/interface'

export class StorageMock implements IStorage {
  public categories: Catalog = {
    categories: [
      {
        id: 'test',
        title: 'test',
        description: 'test',
        ownerId: 'test',
        _valid: jest.fn(),
      },
    ],
    products: [
      {
        id: 'testing',
        title: 'testing',
        description: 'testing',
        price: 10.9,
        category: {
          id: 'test',
          title: 'test',
          description: 'test',
          ownerId: 'test',
          _valid: jest.fn(),
        },
        ownerId: 'test',
        _valid: jest.fn(),
      },
    ],
  }

  async getCatalog(fileName: string): Promise<Catalog> {
    return this.categories
  }
}
