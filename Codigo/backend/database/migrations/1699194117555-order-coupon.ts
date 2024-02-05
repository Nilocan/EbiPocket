import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderCoupon1699194117555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "order"
        ADD "coupon_name" varchar;
    `);

    await queryRunner.query(`
        ALTER TABLE "order"
        ADD CONSTRAINT "FK_coupon_order"
        FOREIGN KEY ("coupon_name")
        REFERENCES "coupon"("name")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "order" DROP CONSTRAINT "FK_coupon_order";
        ALTER TABLE "order" DROP COLUMN "coupon_name";
    `);
  }
}
