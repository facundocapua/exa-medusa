import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class BrandLogo1708108561807 implements MigrationInterface {
  name = 'BrandLogo1708108561807'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "brand" ADD COLUMN "logo" character varying')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "logo"')
  }
}
