import { BaseEntity, generateEntityId } from '@medusajs/medusa'
import { BeforeInsert, Column, Entity } from 'typeorm'

@Entity()
export class OrderReturnRequest extends BaseEntity {
  @Column({ type: 'varchar' })
    first_name: string

  @Column({ type: 'varchar' })
    last_name: string

  @Column({ type: 'varchar' })
    email: string

  @Column({ type: 'varchar', nullable: true })
    phone: string

  @Column({ type: 'varchar' })
    order_number: string

  @Column({ type: 'varchar' })
    notes: string

  @BeforeInsert()
  private beforeInsert (): void {
    this.id = generateEntityId(this.id, 'order_return_request')
  }
}
