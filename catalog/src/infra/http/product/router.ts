import { Router, type RequestHandler } from 'express'
import { ProductController } from './controller'

const router = Router()
const controller = new ProductController()

router.get('/:ownerId', controller.getAll.bind(controller) as RequestHandler)
router.post('/', controller.register.bind(controller) as RequestHandler)
router.put('/:id', controller.updateById.bind(controller) as RequestHandler)
router.delete(
  '/:ownerId/:productId',
  controller.deleteById.bind(controller) as RequestHandler,
)

export default router
