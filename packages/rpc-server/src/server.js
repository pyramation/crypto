import express from 'express';
import request from 'request';
import bodyParser from 'body-parser';
import env from './env';

const app = express();
app.use(bodyParser.json());

const url = /^http/.test(env.DAEMON_URL)
  ? env.DAEMON_URL
  : `http://${env.DAEMON_URL}`;

const makereq = (method, params = []) => {
  const body = { jsonrpc: '1.0', id: 'curltext', method, params };
  console.log(JSON.stringify(body));
  return new Promise((resolve, reject) => {
    request.post(
      {
        headers: {
          'content-type': 'text/plain;'
        },
        url,
        body: JSON.stringify(body)
      },
      function (error, response, data) {
        if (error) {
          return reject(error);
        }
        try {
          const json = JSON.parse(data);
          return resolve(json.result);
        } catch (e) {
          return reject(e);
        }
      }
    );
  });
};

const str = (i) => i;
const int = (i) => parseInt(i, 10);

// 1 param
[
  ['getblockhash', int],
  ['getblock', str],
  ['getrawtransaction', str],
  ['decoderawtransaction', str]
].forEach(([method, cast]) => {
  app.get(`/${method}/:first`, async (req, res, next) => {
    try {
      const result = await makereq(method, [cast(req.params.first)]);
      res.set('Content-Type', 'application/json');
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  });
});

// 0 param
[
  'getblockcount',
  'getbestblockhash',
  'getconnectioncount',
  'getdifficulty',
  'getblockchaininfo',
  'getmininginfo',
  'getpeerinfo',
  'getrawmempool'
].forEach((method) => {
  app.get(`/${method}`, async (req, res, next) => {
    try {
      const result = await makereq(method);
      res.set('Content-Type', 'application/json');
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  });
});

app.use(async (error, req, res, next) => {
  return res.status(500).send({ message: error.message });
});

app.listen(env.SERVER_PORT, env.SERVER_HOST, () =>
  console.log(`app listening: ${env.SERVER_HOST}:${env.SERVER_PORT}`)
);
