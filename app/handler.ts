import AWS from 'aws-sdk';
import https from 'https';
import { Router, Route, Namespace } from 'vingle-corgi';

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
      Route.GET(
        '/followers',
        {
          operationId: 'dev/followers',
        },
        {},
        async function() {
          return this.json({
            data: { hello: 'world ' },
          });
        }
      ),
    ],
  }),
]);

export const handler = router.handler();
