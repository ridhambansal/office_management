import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

/**
 * Updated config object to ensure 'port' is a number
 * and provide local PG defaults if env variables are missing.
 */
const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'ridham',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'testdb',
  entities: ['dist/*/.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: ['query', 'error'],
  synchronize: true,
};

export const typeOrmConfigProvider = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
