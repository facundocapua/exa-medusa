import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class BannerAddSalonId1739445386446 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "banner" ADD COLUMN "salon_id" character varying NULL'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "banner" DROP COLUMN "salon_id"'
    )
  }
}
