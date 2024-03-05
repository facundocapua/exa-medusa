import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct
} from '@medusajs/medusa'
import { Brand } from './brand'

@Entity()
export class Product extends MedusaProduct {
  @Column()
    brand_id?: string

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
    brand?: Brand
}
