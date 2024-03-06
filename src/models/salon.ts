import { BaseEntity, generateEntityId } from '@medusajs/medusa'
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { Brand } from './brand'

@Entity()
export class Salon extends BaseEntity {
  @Column({ type: 'varchar' })
    name: string

  @Column({ type: 'numeric', nullable: true })
    lat: string

  @Column({ type: 'numeric', nullable: true })
    lng: string

  @Column({ type: 'varchar', nullable: true })
    address: string

  @Column({ type: 'varchar', nullable: true })
    city: string

  @Column({ type: 'varchar', nullable: true })
    state: string

  @Column('jsonb', { nullable: false, default: {} })
    hours: string

  @Column({ type: 'varchar', nullable: true })
    website: string

  @Column('jsonb', { nullable: false, default: {} })
    social_networks: string

  @Column({ type: 'varchar', nullable: true })
    map: string

  @Column({ type: 'varchar', nullable: true })
    phone: string

  @Column({ type: 'varchar', nullable: true })
    email: string

  @Column({ type: 'varchar', nullable: true })
    map_link: string

  @Column({ type: 'bool', default: true })
    is_active: boolean

  @ManyToMany(() => Brand)
  @JoinTable({
    name: 'salon_brand',
    joinColumn: { name: 'salon_id' },
    inverseJoinColumn: { name: 'brand_id' }
  })
    brands: Brand[]

  @BeforeInsert()
  private beforeInsert (): void {
    this.id = generateEntityId(this.id, 'salon')
  }
}
