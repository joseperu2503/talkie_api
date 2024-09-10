import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  database: process.env.DB_NAME,
  username: process.env.DB_USERMAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(dataSourceOptions);
