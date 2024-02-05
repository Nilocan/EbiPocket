import { MigrationInterface, QueryRunner } from 'typeorm';

export class Address1698501338155 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "address" (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                "userId" uuid NOT NULL,
                "address" json NOT NULL
            );

            ALTER TABLE "address"
            ADD CONSTRAINT "fk_user"
            FOREIGN KEY ("userId")
            REFERENCES "user"("id")
            ON DELETE NO ACTION
            ON UPDATE CASCADE;
        `);

    await queryRunner.query(`
            TRUNCATE TABLE "order" CASCADE;
    
            ALTER TABLE "order"
            ADD COLUMN "addressId" uuid NOT NULL;

            ALTER TABLE "order"
            ADD CONSTRAINT "fk_address"
            FOREIGN KEY ("addressId")
            REFERENCES "address"("id")
            ON DELETE NO ACTION
            ON UPDATE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE order DROP CONSTRAINT "fk_address";
        DROP TABLE address;
    `);
  }
}
