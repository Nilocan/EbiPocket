import { MigrationInterface, QueryRunner } from 'typeorm';

export class DishAndMenu1696289737386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "menu" (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "name" varchar(255) NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "dish" (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "price" float NOT NULL,
        "category" varchar(255) NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "menu_dish" (
        "menu_id" uuid NOT NULL,
        "dish_id" uuid NOT NULL,
        CONSTRAINT "PK_c64c231fbb3d9dbb3ad55c71d6a" PRIMARY KEY ("menu_id", "dish_id"),
        CONSTRAINT "FK_menu_dish_menu" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_menu_dish_dish" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "menu_dish"`);
    await queryRunner.query(`DROP TABLE "dish"`);
    await queryRunner.query(`DROP TABLE "menu"`);
  }
}
