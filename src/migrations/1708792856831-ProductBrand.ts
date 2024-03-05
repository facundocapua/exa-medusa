import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class ProductBrand1708792856831 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product" ADD COLUMN "brand_id" character varying'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product" DROP COLUMN "brand_id"'
    )
  }
}
