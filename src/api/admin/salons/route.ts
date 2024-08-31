import { type MedusaRequest, type MedusaResponse } from '@medusajs/medusa'
import { type DeepPartial } from 'react-hook-form'
import { type Salon } from 'src/models/salon'
import type SalonRepository from 'src/repositories/salon'
import { type EntityManager } from 'typeorm'

export async function GET (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const salonRepository: typeof SalonRepository =
    req.scope.resolve('salonRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const salonRepo = manager.withRepository(salonRepository)

  return res.json({
    salons: await salonRepo.find({
      order: {
        name: 'ASC'
      }
    })
  })
}

export async function POST (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
  const salonRepository: typeof SalonRepository =
    req.scope.resolve('salonRepository')
  const manager: EntityManager = req.scope.resolve('manager')
  const salonRepo = manager.withRepository(salonRepository)
  const data: DeepPartial<Salon> = req.body as DeepPartial<Salon>
  const salon = salonRepo.create(data as Salon)
  await salonRepo.save(salon)

  return res.status(200).json({ salon })
}
