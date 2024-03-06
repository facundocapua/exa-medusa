import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class BannerCreate1709677247111 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create table banner
    (
        id varchar not null constraint banner_pk primary key,
        title      varchar not null,
        image       varchar,
        link       varchar not null,
        is_active  boolean,
        created_at timestamp with time zone default now() not null,
        updated_at timestamp with time zone default now() not null
    );
    `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table banner;')
  }
}
