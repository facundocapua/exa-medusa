import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class BrandAlter1708548136612 implements MigrationInterface {
  name = 'BrandAlter1708548136612'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "brand" ADD "is_active" boolean DEFAULT true')
    await queryRunner.query('ALTER TABLE "brand" ADD "is_featured" boolean DEFAULT false')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "is_featured"')
    await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "is_active"')
  }
}
