import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type EntityManager } from 'typeorm'
import type BrandRepository from 'src/repositories/brand'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const brandRepository: typeof BrandRepository = req.scope.resolve('brandRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const brandRepo = manager.withRepository(brandRepository)

  const handle = req.query.handle as string
  const isFeatured = req.query.is_featured === 'true'

  return res.json({
    brands: await brandRepo.find({
      where: {
        is_active: true,
        handle: handle ?? undefined,
        is_featured: isFeatured
      },
      order: {
        name: 'ASC'
      }
    })
  })
}
