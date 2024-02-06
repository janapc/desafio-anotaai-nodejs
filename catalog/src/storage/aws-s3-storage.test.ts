import { AwsS3Storage } from './aws-s3-storage'
import { type Catalog } from './interface'

const catalogMock: Catalog = {
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

const mockS3Instance = {
  send: jest.fn().mockResolvedValue({
    Body: {
      transformToString: jest.fn().mockReturnValue(JSON.stringify(catalogMock)),
    },
  }),
}

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => mockS3Instance),
    GetObjectCommand: jest.fn().mockReturnThis(),
    PutObjectCommand: jest.fn().mockReturnThis(),
  }
})

describe('Aws S3 Storage', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Should get catalog', async () => {
    const spySend = jest.spyOn(mockS3Instance, 'send')
    const storage = new AwsS3Storage('test-bucket')
    const result = await storage.getCatalog('test.json')
    expect(result).not.toEqual(null)
    expect(result.categories).toHaveLength(1)
    expect(result.products).toHaveLength(1)
    expect(spySend).toHaveBeenCalledTimes(1)
  })

  it('Should not get catalog if did not find the file', async () => {
    const spySend = jest
      .spyOn(mockS3Instance, 'send')
      .mockReturnValue({ Body: { transformToString: jest.fn() } })
    const storage = new AwsS3Storage('test-bucket')
    await expect(storage.getCatalog('test.json')).rejects.toThrow(
      "I didn't find this test.json file on S3",
    )
    expect(spySend).toHaveBeenCalledTimes(1)
  })
})
