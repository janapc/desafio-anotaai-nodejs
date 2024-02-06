import { type Request, type Response, type NextFunction } from 'express'
import {
  RegisterCategoryUsecase,
  type input as registerInput,
} from '@usecases/category/RegisterCategoryUsecase'
import { MongoDbCategoryRepository } from '@infra/database/repositories/category'
import { GetAllCategoryUsecase } from '@usecases/category/GetAllCategoryUsecase'
import {
  UpdateCategoryUsecase,
  type input as updateInput,
} from '@usecases/category/UpdateCategoryUsecase'
import { DeleteCategoryUsecase } from '@usecases/category/DeleteCategoryUsecase'
import { categoryModel } from '@infra/database/schemas/category'
import { AwsSnsEvent } from '@infra/events/aws-sns-event'
import { AwsS3Storage } from 'storage/aws-s3-storage'

export class CategoryController {
  private readonly categoryRepository: MongoDbCategoryRepository
  private readonly event: AwsSnsEvent
  private readonly storage: AwsS3Storage
  constructor() {
    this.categoryRepository = new MongoDbCategoryRepository(categoryModel)
    this.event = new AwsSnsEvent(String(process.env.AWS_SNS_TOPIC))
    this.storage = new AwsS3Storage(String(process.env.AWS_BUCKET_NAME))
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ownerId } = req.params
      const usecase = new GetAllCategoryUsecase(this.storage)
      const result = await usecase.execute(ownerId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body: registerInput = req.body
      const usecase = new RegisterCategoryUsecase(
        this.categoryRepository,
        this.event,
      )
      const result = await usecase.execute(body)
      res.status(201).json(result)
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
      const usecase = new UpdateCategoryUsecase(
        this.categoryRepository,
        this.event,
      )
      const input: updateInput = {
        id,
        title: body.title,
        description: body.description,
      }
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
      const { ownerId, categoryId } = req.params
      const usecase = new DeleteCategoryUsecase(
        this.categoryRepository,
        this.event,
      )
      await usecase.execute(categoryId, ownerId)
      res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }
}
