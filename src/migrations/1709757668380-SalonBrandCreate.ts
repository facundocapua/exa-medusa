import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class SalonBrandCreate1709757668380 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table salon_brand
        (
            brand_id varchar not null constraint salon_brand_brand_fkey
            references brand on update cascade on delete cascade,
        
            salon_id varchar not null constraint salon_brand_store_fkey
            references salon on update cascade on delete cascade,
            
            constraint salon_brand_pkey primary key (brand_id, salon_id)
        );
        `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table salon_brand;')
  }
}
