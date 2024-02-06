import { Router, type RequestHandler } from 'express'
import { CategoryController } from './controller'

const router = Router()

const controller = new CategoryController()

router.post('/', controller.register.bind(controller) as RequestHandler)
router.get('/:ownerId', controller.getAll.bind(controller) as RequestHandler)
router.put('/:id', controller.updateById.bind(controller) as RequestHandler)
router.delete(
  '/:ownerId/:categoryId',
  controller.deleteById.bind(controller) as RequestHandler,
)

export default router
