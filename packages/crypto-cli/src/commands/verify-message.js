import Networks from '@pyramation/crypto-networks';
import { verifyMessage } from '@pyramation/crypto-keys';
import inquirer from 'inquirer';
import fuzzy from 'fuzzy';
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

const searchCoins = (answers, input) => {
  input = input || '';
  return new Promise(function (resolve) {
    setTimeout(function () {
      const fuzzyResult = fuzzy.filter(input, Object.keys(Networks));
      resolve(
        fuzzyResult.map(function (el) {
          return el.original;
        })
      );
    }, 25);
  });
};

export default () => {
  inquirer
    .prompt([
      {
        type: 'autocomplete',
        name: 'network',
        message: 'pick a coin',
        source: searchCoins,
        required: true
      },
      {
        type: 'string',
        name: 'signature',
        message: 'signature',
        required: true
      },
      {
        type: 'string',
        name: 'message',
        message: 'message',
        required: true
      },
      {
        type: 'string',
        name: 'pubkey',
        message: 'pubkey',
        required: true
      }
    ])
    .then((answer) => {
      const network = Networks[answer.network];
      const result = verifyMessage(
        answer.message,
        answer.pubkey,
        answer.signature,
        network
      );
      console.log({ result });
    });
};
