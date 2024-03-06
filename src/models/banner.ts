import { BaseEntity, generateEntityId } from '@medusajs/medusa'
import { BeforeInsert, Column, Entity } from 'typeorm'

@Entity()
export class Banner extends BaseEntity {
  @Column({ type: 'varchar' })
    title: string

  @Column({ type: 'varchar' })
    image: string

  @Column({ type: 'varchar' })
    image_mobile: string

  @Column({ type: 'varchar' })
    link: string

  @Column({ type: 'bool', nullable: true, default: true })
    is_active: boolean

  @BeforeInsert()
  private beforeInsert (): void {
    this.id = generateEntityId(this.id, 'banner')
  }
}
