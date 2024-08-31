import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type Salon } from 'src/models/salon'
import type SalonRepository from 'src/repositories/salon'
import { type DeepPartial, type EntityManager } from 'typeorm'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const salonRepository: typeof SalonRepository = req.scope.resolve('salonRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const salonRepo = manager.withRepository(salonRepository)
  const id = req.params.id
  const salon = await salonRepo.findOneOrFail({ where: { id } })
  return res.json({
    salon
  })
}

export async function POST (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const salonRepository: typeof SalonRepository = req.scope.resolve('salonRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const salonRepo = manager.withRepository(salonRepository)
  const data: DeepPartial<Salon> = req.body as DeepPartial<Salon>

  const id = req.params.id
  const salon = await salonRepo.findOneOrFail({ where: { id } })

  Object.assign(salon, data)

  await salonRepo.save(salon)

  return res.status(200).json({ salon })
}

export async function DELETE (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const salonRepository: typeof SalonRepository = req.scope.resolve('salonRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const salonRepo = manager.withRepository(salonRepository)
  const id = req.params.id
  const salon = await salonRepo.findOneOrFail({ where: { id } })

  await salonRepo.remove(salon)

  return res.status(200).json({ id })
}
