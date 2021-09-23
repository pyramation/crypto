import inquirer from 'inquirer';
import { randomBytes } from 'crypto';

export default () => {
  inquirer
    .prompt([
      {
        type: 'string',
        name: 'saltBytes',
        message: 'enter the salt num bytes (e.g. 16)',
        required: true
      }
    ])
    .then((answer) => {
      const buf = randomBytes(parseInt(answer.saltBytes, 10));
      console.log(buf.toString('base64'));
    });
};
