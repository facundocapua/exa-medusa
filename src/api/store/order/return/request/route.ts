import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type DeepPartial, type EntityManager } from 'typeorm'
import type OrderReturnRequestRepo from 'src/repositories/orderReturnRequest'
import { type OrderReturnRequest } from 'src/models/orderReturnRequest'

export async function POST (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const orderRequestReturnRepository: typeof OrderReturnRequestRepo =
    req.scope.resolve('orderReturnRequestRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const orderReturnRequestRepo = manager.withRepository(orderRequestReturnRepository)
  const data: DeepPartial<OrderReturnRequest> = req.body as DeepPartial<OrderReturnRequest>
  const orderReturnRequest = orderReturnRequestRepo.create(data)
  await orderReturnRequestRepo.save(orderReturnRequest)

  return res.status(200).json({ orderReturnRequest })
}
