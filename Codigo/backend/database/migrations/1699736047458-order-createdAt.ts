import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderCreatedAt1699736047458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "order"
        ADD "createdAt" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "order" DROP COLUMN "createdAt";
    `);
  }
}
