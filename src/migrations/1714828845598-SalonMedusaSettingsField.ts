import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class SalonMedusaSettingsField1714828845598 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "salon" ADD COLUMN "medusa_settings" jsonb NULL'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "salon" DROP COLUMN "medusa_settings"'
    )
  }
}
