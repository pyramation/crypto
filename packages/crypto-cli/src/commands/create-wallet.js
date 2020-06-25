import allCoins from '@pyramation/crypto-coins';
import {
  newWallet,
  verifyPrivate,
  infoForWalletNet,
  networkFromCurrencyGeneratorArray,
  getNetworkFromHashAndWifVersion
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
      }
    ])
    .then((answer) => {
      var i = coins.indexOf(answer.coin);
      if (i > -1) {
        var picked = allCoins[i];
        const network = networkFromCurrencyGeneratorArray(picked);
        const wallet = newWallet(network);
        console.log({ public: wallet.public, private: wallet.private });
      }
    });
};
