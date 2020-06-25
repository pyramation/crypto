import Networks from '@pyramation/crypto-networks';
import {
  signMessageWithKey,
  signMessageWithMnemonic
} from '@pyramation/crypto-keys';
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
        name: 'message',
        message: 'message',
        required: true
      },
      {
        type: 'string',
        name: 'privkey',
        message: 'type private key or mnemonic',
        required: true
      }
    ])
    .then((answer) => {
      const network = Networks[answer.network];
      const privkey = answer.privkey.trim();
      let useMnemonic = false;
      if (privkey.split(' ').length > 1) {
        useMnemonic = true;
      }
      const { message } = answer;

      if (useMnemonic) {
        console.log(signMessageWithMnemonic(message, privkey, network));
      } else {
        console.log(signMessageWithKey(message, privkey, network));
      }
    });
};
