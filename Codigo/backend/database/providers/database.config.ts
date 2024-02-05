import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

export const defaultDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  migrations: ['./database/migrations/*.ts'],
  migrationsTableName: 'migrations_check',
});
