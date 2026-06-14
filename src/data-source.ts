import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Stage } from './entities/Stage';
import { Topic } from './entities/Topic';
import { Problem } from './entities/Problem';
import { UserProgress } from './entities/UserProgress';
import { Streak } from './entities/Streak';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // In dev, TypeORM auto-creates/updates tables to match entities.
  // Set to false in production and use explicit migrations instead.
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: [User, Stage, Topic, Problem, UserProgress, Streak],
  ssl: false,
});
