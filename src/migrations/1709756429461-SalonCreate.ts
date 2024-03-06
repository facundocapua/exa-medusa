import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class SalonCreate1709756429461 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create table salon
    (
        id varchar not null constraint salon_pk primary key,
        name            varchar                                            not null,
        lat             numeric                                            not null,
        lng             numeric                                            not null,
        is_active       boolean                  default true              not null,
        address         varchar,
        city            varchar,
        state           varchar,
        hours           jsonb,
        website         varchar,
        social_networks json,
        map             varchar,
        phone           varchar,
        email           varchar,
        map_link        varchar,
        created_at timestamp with time zone default now() not null,
        updated_at timestamp with time zone default now() not null
    );
    `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table salon;')
  }
}
