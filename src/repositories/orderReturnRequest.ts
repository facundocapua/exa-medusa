import { OrderReturnRequest } from '../models/orderReturnRequest'
import {
  dataSource
} from '@medusajs/medusa/dist/loaders/database'

export const OrderReturnRequestRepository = dataSource
  .getRepository(OrderReturnRequest)

export default OrderReturnRequestRepository
