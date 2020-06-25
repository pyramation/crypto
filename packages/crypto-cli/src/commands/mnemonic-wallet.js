import Networks from '@pyramation/crypto-networks';
import { generateMnemonicWallet } from '@pyramation/crypto-keys';
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
      }
    ])
    .then((answer) => {
      const network = Networks[answer.network];
      console.log(generateMnemonicWallet(network));
    });
};
