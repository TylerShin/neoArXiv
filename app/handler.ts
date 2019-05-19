import AWS from 'aws-sdk';
import https from 'https';
import { Router, Namespace } from 'vingle-corgi';
import userRoutes from './routes/user';

AWS.config.update({
  region: 'us-east-1',
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
});

const router = new Router([
  new Namespace('/api', {
    children: [
      userRoutes
    ],
  }),
]);

export const handler = async (event: any, context: any) => {
  console.log(JSON.stringify(event, null, 2));
  return await router.handler()(event, context);
};