import { MigrationInterface, QueryRunner } from 'typeorm';

export class File1697675860195 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE dish
    ADD COLUMN file VARCHAR(255) NULL;`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE dish
    DROP COLUMN file;`);
  }
}
