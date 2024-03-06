import { Salon } from '../models/salon'
import {
  dataSource
} from '@medusajs/medusa/dist/loaders/database'

export const SalonRepository = dataSource
  .getRepository(Salon)

export default SalonRepository
