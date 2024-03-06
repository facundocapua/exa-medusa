import { Banner } from '../models/banner'
import {
  dataSource
} from '@medusajs/medusa/dist/loaders/database'

export const BannerRepository = dataSource
  .getRepository(Banner)

export default BannerRepository
