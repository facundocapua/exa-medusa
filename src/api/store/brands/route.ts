import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { Brand } from "../../../models/brand"
import { EntityManager } from "typeorm"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const manager: EntityManager = req.scope.resolve("manager")
  const brandRepo = manager.getRepository(Brand)

  return res.json({
    brands: await brandRepo.find(),
  })
}
