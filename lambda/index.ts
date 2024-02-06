import { type SQSHandler, type SQSEvent } from 'aws-lambda'
import { extractData } from './infra/utils/utils'
import { AwsStorageS3 } from './infra/storage/aws-storage-s3'
import { mongoDBConnection } from './infra/database/connection'
import { MongoDbProductRepository } from './infra/database/repositories/product'
import { productModel } from './infra/database/schemas/product'
import { PutProductUseCase } from './usecases/put-product'
import { MongoDbCategoryRepository } from './infra/database/repositories/category'
import { categoryModel } from './infra/database/schemas/category'
import { PutCategoryUseCase } from './usecases/put-category'
import { NewStorageUseCase } from './usecases/new-storage'

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.info('starting to process...')
  try {
    await mongoDBConnection()
    const storage = new AwsStorageS3(String(process.env.AWS_BUCKET_NAME))
    for (const record of event.Records) {
      const message = extractData(record)
      const ownerId = message.ownerId
      const fileName = `${ownerId}-catalog.json`
      const productRepository = new MongoDbProductRepository(productModel)
      const categoryRepository = new MongoDbCategoryRepository(categoryModel)
      try {
        const catalog = await storage.getCatalog(fileName)
        if (message.type === 'product') {
          const usecase = new PutProductUseCase(productRepository, storage)
          await usecase.execute(message, catalog, fileName)
        } else {
          const usecase = new PutCategoryUseCase(categoryRepository, storage)
          await usecase.execute(message, catalog, fileName)
        }
        console.info('catalog updated successfully')
      } catch (error) {
        let msg: string = ''
        if (error instanceof Error) {
          msg = error.message
        }
        if (
          msg === 'Error getting object from bucket' ||
          msg === 'The specified key does not exist.'
        ) {
          const usecase = new NewStorageUseCase(
            storage,
            categoryRepository,
            productRepository,
          )
          await usecase.execute(fileName, message)
          console.info('catalog updated successfully')
        } else {
          throw new Error(msg)
        }
      }
    }
  } catch (error) {
    let message: string = ''
    if (error instanceof Error) {
      message = error.message
    }
    throw new Error(message)
  }
}
