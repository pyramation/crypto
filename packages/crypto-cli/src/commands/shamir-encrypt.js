import inquirer from 'inquirer';
import { randomBytes } from 'crypto';
import * as secrets from 'secrets.js-grempe';

function utf8ToHex(str) {
  return Array.from(str)
    .map((c) =>
      c.charCodeAt(0) < 128
        ? c.charCodeAt(0).toString(16)
        : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
    )
    .join('');
}

function hexToUtf8(hex) {
  return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'));
}

export default () => {
  inquirer
    .prompt([
      {
        type: 'string',
        name: 'key',
        message: 'enter a string to encrypt',
        required: true
      },
      {
        type: 'string',
        name: 'parts',
        message: 'enter the total number of parts (e.g. 5)',
        required: true
      },
      {
        type: 'string',
        name: 'quorum',
        message: 'enter the number of parts required to decrypt (e.g. 3)',
        required: true
      }
    ])
    .then((answer) => {
      const parts = parseInt(answer.parts, 10);
      const quorum = parseInt(answer.quorum, 10);
      const { key } = answer;

      const shares = secrets.share(utf8ToHex(key), parts, quorum);

      console.log(shares);

      shares.forEach((str) => {
        console.log(str);
      });
    });
};
