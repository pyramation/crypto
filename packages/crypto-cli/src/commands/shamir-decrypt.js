import inquirer from 'inquirer';
import { split, join } from 'shamir';
import { randomBytes } from 'crypto';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

function hexToBytes(hex) {
  hex = hex.replace(/ /g, ''); // strip spaces
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return new Uint8Array(bytes);
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
          name: `parts[${i}]`,
          message: 'enter part[' + i + ']',
          required: true
        });
      }

      inquirer.prompt(partArray).then((result) => {
        console.log(result);
        const utf8Decoder = new TextDecoder();
        const obj = {};
        const parts = result.parts.forEach((part, i) => {
          obj[i + 1] = hexToBytes(part);
        });

        const recovered = join(obj);
        console.log('recovered');
        console.log(recovered);
        console.log('utf8Decoder.decode(recovered)');
        console.log(utf8Decoder.decode(recovered));
      });
    });
};
