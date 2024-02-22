import { Brand } from '../models/brand'
import {
  dataSource
} from '@medusajs/medusa/dist/loaders/database'

export const BrandRepository = dataSource
  .getRepository(Brand)

export default BrandRepository
