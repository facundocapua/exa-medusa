import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class SalonSalesChannelIdField1714829673846 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "salon" ADD COLUMN "sales_channel_id" character varying NULL'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "salon" DROP COLUMN "sales_channel_id"'
    )
  }
}
