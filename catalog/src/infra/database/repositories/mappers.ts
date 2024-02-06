import { type HydratedDocument } from 'mongoose'
import { Category } from '@entities/category'
import { Product } from '@entities/product'

export function mongoDBToCategoryDomain(
  body: HydratedDocument<Category>,
): Category {
  const category = new Category(body.title, body.description, body.ownerId)
  category.id = String(body.id)
  return category
}

export function mongoDBToProductDomain(
  body: HydratedDocument<Product>,
): Product {
  const category = new Category(
    body.category.title,
    body.category.description,
    body.category.ownerId,
  )
  category.id = String(body.category.id)
  const product = new Product(
    body.title,
    body.description,
    body.price,
    body.ownerId,
    category,
  )
  product.id = String(body.id)
  return product
}
