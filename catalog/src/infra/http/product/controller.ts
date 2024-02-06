import { type NextFunction, type Request, type Response } from 'express'
import { MongoDbProductRepository } from '@infra/database/repositories/product'
import {
  RegisterProductUsecase,
  type input as registerInput,
} from '@usecases/product/RegisterProductUsecase'
import { MongoDbCategoryRepository } from '@infra/database/repositories/category'
import {
  UpdateProductUsecase,
  type input as updateInput,
} from '@usecases/product/UpdateProductUsecase'
import { DeleteProductUsecase } from '@usecases/product/DeleteProductUsecase'
import { GetAllProductUsecase } from '@usecases/product/GetAllProductUsecase'
import { categoryModel } from '@infra/database/schemas/category'
import { productModel } from '@infra/database/schemas/product'
import { AwsSnsEvent } from '@infra/events/aws-sns-event'
import { AwsS3Storage } from 'storage/aws-s3-storage'

export class ProductController {
  private readonly productRepository: MongoDbProductRepository
  private readonly categoryRepository: MongoDbCategoryRepository
  private readonly event: AwsSnsEvent
  private readonly storage: AwsS3Storage

  constructor() {
    this.productRepository = new MongoDbProductRepository(productModel)
    this.categoryRepository = new MongoDbCategoryRepository(categoryModel)
    this.event = new AwsSnsEvent(String(process.env.AWS_SNS_TOPIC))
    this.storage = new AwsS3Storage(String(process.env.AWS_BUCKET_NAME))
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = req.body
      const usecase = new RegisterProductUsecase(
        this.productRepository,
        this.categoryRepository,
        this.event,
      )
      const result = await usecase.execute(body as registerInput)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  async updateById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = req.body
      const { id } = req.params
      const usecase = new UpdateProductUsecase(
        this.productRepository,
        this.categoryRepository,
        this.event,
      )
      const input: updateInput = { ...body, id }
      const result = await usecase.execute(input)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async deleteById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { ownerId, productId } = req.params

      const usecase = new DeleteProductUsecase(
        this.productRepository,
        this.event,
      )
      await usecase.execute(productId, ownerId)
      res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ownerId } = req.params
      const usecase = new GetAllProductUsecase(this.storage)
      const result = await usecase.execute(ownerId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}
