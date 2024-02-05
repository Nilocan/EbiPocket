import { MigrationInterface, QueryRunner } from 'typeorm';

export class Coupon1699191912573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "coupon" (
            "name" varchar PRIMARY KEY,
            "discount" float NOT NULL,
            "minValue" float NOT NULL
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "coupon";
    `);
  }
}
