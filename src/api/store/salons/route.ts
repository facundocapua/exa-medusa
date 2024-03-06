import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type EntityManager } from 'typeorm'
import type SalonRepository from 'src/repositories/salon'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const salonRepository: typeof SalonRepository = req.scope.resolve('salonRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const salonRepo = manager.withRepository(salonRepository)

  return res.json({
    salons: await salonRepo.find({
      where: {
        is_active: true
      },
      relations: {
        brands: true
      }
    })
  })
}
