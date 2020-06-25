import allCoins from '@pyramation/crypto-coins';
import {
  verifyPrivate,
  networkFromCurrencyGeneratorArray
} from '@pyramation/crypto-keys';
import inquirer from 'inquirer';
import fuzzy from 'fuzzy';
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);
const coins = allCoins.map((c) => {
  return c[0];
});

const searchCoins = (answers, input) => {
  input = input || '';
  return new Promise(function (resolve) {
    setTimeout(function () {
      const fuzzyResult = fuzzy.filter(input, coins);
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
        name: 'coin',
        message: 'pick a coin',
        source: searchCoins,
        required: true
      },
      {
        type: 'password',
        name: 'privateKey',
        message: 'enter a private key',
        required: true
      }
    ])
    .then((answer) => {
      var i = coins.indexOf(answer.coin);
      if (i > -1) {
        var picked = allCoins[i];
        console.log(
          verifyPrivate(
            answer.privateKey,
            networkFromCurrencyGeneratorArray(picked)
          )
        );
      }
    });
};
