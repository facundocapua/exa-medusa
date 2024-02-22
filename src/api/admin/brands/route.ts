import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type DeepPartial } from 'react-hook-form'
import { type Brand } from 'src/models/brand'
import type BrandRepository from 'src/repositories/brand'
import { type EntityManager } from 'typeorm'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const brandRepository: typeof BrandRepository =
    req.scope.resolve('brandRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const brandRepo = manager.withRepository(brandRepository)

  return res.json({
    brands: await brandRepo.find({
      order: {
        name: 'ASC'
      }
    })
  })
}

export async function POST (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const brandRepository: typeof BrandRepository =
    req.scope.resolve('brandRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const brandRepo = manager.withRepository(brandRepository)
  const data: DeepPartial<Brand> = req.body
  const brand = brandRepo.create(data)
  await brandRepo.save(brand)

  return res.status(200).json({ brand })
}
