
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
                    if (json.error) {
                        return reject(json.error);
                    }
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

const COMMANDS = [
    ['getblockhash', int],
    ['getblock', str],
    ['getrawtransaction', str],
    ['decoderawtransaction', str],
    ['sendrawtransaction', str],
    ['getblockcount'],
    ['getbestblockhash'],
    ['getconnectioncount'],
    ['getdifficulty'],
    ['getblockchaininfo'],
    ['getmininginfo'],
    ['getpeerinfo'],
    ['getrawmempool'],
];
const DIG = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const makeUrl = (method, args) => {
    if (!args.length) return `/${method}`;
    return `/${method}/` + args.map((arg, i) => `:${DIG[i]}`).join('/');
}

const callReq = async (method, req, args) => {
    if (!args.length) return await makereq(method);
    const casted = args.map((cast, i)=>  cast(req.params[DIG[i]]));
    return await makereq(method, casted);
}

COMMANDS.forEach(([method, ...args]) => {
    app.get(makeUrl(method, args), async (req, res, next) => {
        try {
            const result = await callReq(method, req, args);
            res.status(200);
            res.json(result);
        } catch (e) {
            next(e);
        }
    });
});

app.use(async (error, req, res, next) => {
    return res.status(500).send({ message: error.message });
});

export default () => {
    app.listen(env.SERVER_PORT, env.SERVER_HOST, () =>
        console.log(`app listening: ${env.SERVER_HOST}:${env.SERVER_PORT}`)
    );
};