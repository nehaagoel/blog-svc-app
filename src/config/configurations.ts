import { config } from 'dotenv';
import { IConfig } from './Iconfig';

config();

export const configurations: IConfig = Object.freeze({
  env: process.env.NODE_ENV,
  mongo: process.env.MONGO_URL,
  port: process.env.PORT,
}) as IConfig;

export default configurations;