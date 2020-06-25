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
        type: 'string',
        name: 'publicKeyHash',
        message: 'enter a public key hash hex (without preceeding 0x)',
        required: true
      },
      {
        type: 'string',
        name: 'privateKeyHash',
        message: 'enter a private key hash hex (without preceeding 0x)',
        required: true
      }
    ])
    .then((answer) => {
      const network = getNetworkFromHashAndWifVersion(
        parseInt(answer.publicKeyHash, 16),
        parseInt(answer.privateKeyHash, 16)
      );
      const wallet = newWallet(network);
      console.log({ public: wallet.public, private: wallet.private });
    });
};
