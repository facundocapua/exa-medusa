import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class BrandCreate1704748105228 implements MigrationInterface {
  name = 'BrandCreate1704748105228'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "authorId"')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "brand" ADD "authorId" character varying')
  }
}
