import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class BrandFeaturedBanner1739622969200 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "brand" ADD COLUMN "featured_banner" character varying'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "brand" DROP COLUMN "featured_banner"'
    )
  }
}
