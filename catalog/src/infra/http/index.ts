import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import categoryRouter from './category/router'
import productRouter from './product/router'
import bodyParser from 'body-parser'
const app = express()
const port = process.env.APP_PORT

app.use(bodyParser.json())
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use(function (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    error.message === 'category is not found' ||
    error.message === 'product is not found' ||
    error.message === 'the field owner is wrong'
  ) {
    return res.status(404).json({ message: error.message })
  }
  if (error.message.startsWith('these field are required:')) {
    return res.status(400).json({ message: error.message })
  }
  console.error(`${new Date().toISOString()} [error]:`, error.message)
  res.status(500).json({ message: 'internal server error' })
})

export function server(): void {
  app.listen(port, () => {
    console.log('\x1b[32m', `Server running in port ${port}`)
  })
}
