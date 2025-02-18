import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type EntityManager } from 'typeorm'
import type SlideRepository from 'src/repositories/slide'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const slideRepository: typeof SlideRepository = req.scope.resolve('slideRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const slideRepo = manager.withRepository(slideRepository)

  const salonId = req.query.salon_id as string ?? undefined

  return res.json({
    slides: await slideRepo.find({
      where: {
        is_active: true,
        salon_id: salonId
      },
      order: {
        rank: 'ASC'
      }
    })
  })
}
