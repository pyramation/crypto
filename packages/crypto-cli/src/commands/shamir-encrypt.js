import inquirer from 'inquirer';
import { split, join } from 'shamir';
import { randomBytes } from 'crypto';

function hex(arrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n) => ('0' + n.toString(16)).slice(-2))
    .join('');
}

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

export default () => {
  inquirer
    .prompt([
      {
        type: 'string',
        name: 'str',
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
      const { str } = answer;

      const utf8Encoder = new TextEncoder();
      const secretBytes = utf8Encoder.encode(str);

      const out = split(randomBytes, parts, quorum, secretBytes);
      Object.keys(out).forEach((key) => {
        console.log(hex(out[key]));
      });
    });
};
