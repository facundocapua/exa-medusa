import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import type SalonRepository from 'src/repositories/salon'
import { type EntityManager } from 'typeorm'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const salonRepository: typeof SalonRepository = req.scope.resolve('salonRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const salonRepo = manager.withRepository(salonRepository)
  const id = req.params.id
  const salon = await salonRepo.findOneOrFail({
    where: {
      id,
      brands: {
        is_active: true
      }
    },
    relations: {
      brands: true,
      featured_brand: true
    }
  })
  return res.json({
    salon
  })
}
