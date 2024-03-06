import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class SlideCreate1709755249427 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create table slide
    (
        id varchar not null constraint slide_pk primary key,
        title      varchar not null,
        image     varchar,
        image_mobile   varchar,
        link       varchar not null,
        is_active  boolean,
        rank  integer not null,
        created_at timestamp with time zone default now() not null,
        updated_at timestamp with time zone default now() not null
    );
    `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table slide;')
  }
}
