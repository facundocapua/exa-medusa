import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class OrderReturnRequestTable1714418938321 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table if not exists public.order_return_request
        (
            id           varchar                                not null
                constraint order_return_request_pk
                    primary key,
            first_name   varchar                                not null,
            last_name    varchar                                not null,
            email        varchar                                not null,
            phone        varchar,
            order_number varchar                                not null,
            notes        varchar                                not null,
            created_at   timestamp with time zone default now() not null,
            updated_at    timestamp with time zone default now() not null
        );
    `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table salon_brand;')
  }
}
