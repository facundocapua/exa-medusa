import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type Brand } from 'src/models/brand'
import type BrandRepository from 'src/repositories/brand'
import { type DeepPartial, type EntityManager } from 'typeorm'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const brandRepository: typeof BrandRepository = req.scope.resolve('brandRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const brandRepo = manager.withRepository(brandRepository)
  const id = req.params.id
  const brand = await brandRepo.findOneOrFail({ where: { id } })
  return res.json({
    brand
  })
}

export async function POST (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const brandRepository: typeof BrandRepository = req.scope.resolve('brandRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const brandRepo = manager.withRepository(brandRepository)
  const data: DeepPartial<Brand> = req.body as DeepPartial<Brand>

  const id = req.params.id
  const brand = await brandRepo.findOneOrFail({ where: { id } })

  Object.assign(brand, data)

  await brandRepo.save(brand)

  return res.status(200).json({ brand })
}

export async function DELETE (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const brandRepository: typeof BrandRepository = req.scope.resolve('brandRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const brandRepo = manager.withRepository(brandRepository)
  const id = req.params.id
  const brand = await brandRepo.findOneOrFail({ where: { id } })

  await brandRepo.remove(brand)

  return res.status(200).json({ id })
}
