import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class SalonFeaturedBrand1739794576318 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "salon" ADD COLUMN "featured_brand_id" character varying'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "salon" DROP COLUMN "featured_brand_id"'
    )
  }
}
