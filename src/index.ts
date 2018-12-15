/* tslint:disable-next-line */
require('dotenv').config();

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as compress from 'koa-compress';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaStatic from 'koa-static';
import * as logger from 'koa-logger';
// @ts-ignore
import * as koaCors from '@koa/cors';

import errorMiddleware from './middlewares/errorMiddleware';

import authRoutes from './routes/auth';
import db from './models';

import { PORT } from '../config';

async function createApp() {
  const app = new Koa();
  const router = new Router();

  app.use(koaCors());
  app.use(compress());
  app.use(koaBodyParser());
  app.use(koaStatic('../static'));
  app.use(logger());

  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
  } catch (error) {
    console.log('error during connection to DB', error);
    throw new Error(error);
  }
  app.use(errorMiddleware);

  router.use('/api/users', authRoutes.routes());
  app.use(router.routes());

  app.listen(PORT, () => {
    console.log('Server running on port 3000');
  });

  return app;
}

createApp();

export default createApp;
