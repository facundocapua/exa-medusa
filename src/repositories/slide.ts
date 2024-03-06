import { Slide } from '../models/slide'
import {
  dataSource
} from '@medusajs/medusa/dist/loaders/database'

export const SlideRepository = dataSource
  .getRepository(Slide)

export default SlideRepository
