import { TransactionBaseService } from '@medusajs/medusa'
import type SalonRepository from '../repositories/salon'
import { type EntityManager } from 'typeorm'

interface InjectedDependencies {
  manager: EntityManager
  salonRepository: typeof SalonRepository
}

class SalonService extends TransactionBaseService {
  protected salonRepository_: typeof SalonRepository

  constructor ({ salonRepository }: InjectedDependencies) {
    super(arguments[0])

    this.salonRepository_ = salonRepository
  }

  async retrieve (id: string): Promise<any> {
    return await this.salonRepository_.findOne({
      where: { id }
    })
  }

  async retrieveBySalesChannelId (salesChannelId: string): Promise<any> {
    return await this.salonRepository_.findOne({
      where: {
        sales_channel_id: salesChannelId
      }
    })
  }

  async getMedusaSettings ({ salonId, salesChannelId }: { salonId?: string, salesChannelId?: string }): Promise<any> {
    if (!salonId && !salesChannelId) return {}

    const salon = await (salonId ? this.retrieve(salonId) : this.retrieveBySalesChannelId(salesChannelId!))
    if (!salon) return {}

    return salon.medusa_settings
  }
}

export default SalonService
