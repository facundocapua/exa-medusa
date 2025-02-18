import { BaseEntity, generateEntityId } from '@medusajs/medusa'
import { BeforeInsert, Column, Entity } from 'typeorm'

@Entity()
export class Brand extends BaseEntity {
  @Column({ type: 'varchar' })
    name: string

  @Column({ type: 'varchar' })
    handle: string

  @Column({ type: 'varchar', nullable: true })
    logo: string

  @Column({ type: 'varchar', nullable: true })
    featured_banner: string

  @Column({ type: 'bool', nullable: true, default: false })
    is_featured: boolean

  @Column({ type: 'bool', nullable: true, default: true })
    is_active: boolean

  @BeforeInsert()
  private beforeInsert (): void {
    this.id = generateEntityId(this.id, 'brand')
  }
}
