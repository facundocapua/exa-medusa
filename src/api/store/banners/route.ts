import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type EntityManager } from 'typeorm'
import type BannerRepository from 'src/repositories/banner'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const bannerRepository: typeof BannerRepository = req.scope.resolve('bannerRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const bannerRepo = manager.withRepository(bannerRepository)

  return res.json({
    banners: await bannerRepo.find({
      where: {
        is_active: true
      },
      order: {
        title: 'ASC'
      }
    })
  })
}
