import { MigrationInterface, QueryRunner } from 'typeorm';

export class Order1696776786635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "order" (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          "menuId" uuid NOT NULL,
          "userId" uuid NOT NULL,
          "totalPrice" float NOT NULL DEFAULT 0,
          status varchar DEFAULT 'open'
        );
  
        ALTER TABLE "order"
        ADD CONSTRAINT "FK_menu_order"
        FOREIGN KEY ("menuId")
        REFERENCES "menu"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
  
        ALTER TABLE "order"
        ADD CONSTRAINT "FK_user_order"
        FOREIGN KEY ("userId")
        REFERENCES "user"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
      `);

    await queryRunner.query(`
      CREATE TABLE "order_dish" (
        "dish_id" uuid NOT NULL,
        "order_id" uuid NOT NULL,
        PRIMARY KEY ("dish_id", "order_id"),
        CONSTRAINT "FK_order_dish_dish"
          FOREIGN KEY ("dish_id")
          REFERENCES "dish"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "FK_order_dish_order"
          FOREIGN KEY ("order_id")
          REFERENCES "order"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE "order_dish";
  `);

    await queryRunner.query(`
      ALTER TABLE "order" DROP CONSTRAINT "FK_menu_order";
      ALTER TABLE "order" DROP CONSTRAINT "FK_user_order";
      DROP TABLE "order";
    `);
  }
}
