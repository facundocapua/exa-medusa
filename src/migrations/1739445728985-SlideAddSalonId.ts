import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class SlideAddSalonId1739445728985 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "slide" ADD COLUMN "salon_id" character varying NULL'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "slide" DROP COLUMN "salon_id"'
    )
  }
}
