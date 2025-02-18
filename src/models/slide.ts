import { BaseEntity, generateEntityId } from '@medusajs/medusa'
import { BeforeInsert, Column, Entity, ManyToOne, JoinColumn } from 'typeorm'
import { Salon } from './salon'

@Entity()
export class Slide extends BaseEntity {
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

  @Column({ type: 'integer' })
    rank: boolean

  @Column({ type: 'varchar', nullable: true })
    salon_id?: string

  @ManyToOne(() => Salon)
  @JoinColumn({ name: 'salon_id' })
    salon?: Salon

  @BeforeInsert()
  private beforeInsert (): void {
    this.id = generateEntityId(this.id, 'slide')
  }
}
