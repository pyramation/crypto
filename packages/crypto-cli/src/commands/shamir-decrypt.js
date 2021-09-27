import inquirer from 'inquirer';
import * as secrets from 'secrets.js-grempe';

function hexToUtf8(hex) {
  return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'));
}

export default () => {
  inquirer
    .prompt([
      {
        type: 'string',
        name: 'parts',
        message: 'enter the total number of parts (e.g. 5)',
        required: true
      }
    ])
    .then((answer) => {
      const parts = parseInt(answer.parts, 10);

      const partArray = [];
      for (let i = 0; i < parts; i++) {
        partArray.push({
          type: 'string',
          name: `shares[${i}]`,
          message: 'enter part[' + i + ']',
          required: true
        });
      }

      inquirer.prompt(partArray).then(({ shares }) => {
        const combined = secrets.combine(shares);
        console.log(hexToUtf8(combined));
      });
    });
};
