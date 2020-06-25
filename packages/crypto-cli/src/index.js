import inquirer from 'inquirer';
import { Commands as commands } from './cmds';

const keys = Object.keys(commands);

// [
//   { name: 'verify private key', value: 'verify-key' },
//   { name: 'create a mnenomic seed phrase', value: 'create-mnenomic' },
//   { name: 'sign a message', value: 'sign-message' },
//   { name: 'verify a message', value: 'verify-message' },
//   { name: 'create a wallet', value: 'create-wallet' },
//   { name: 'create a wallet from network hash', value: 'custom-wallet' },
//   { name: 'get info for WalletGenerator.net', value: 'new-coin' }
// ]

inquirer
  .prompt([
    {
      type: 'list',
      name: 'cmd',
      message: 'what do you want to do?',
      choices: keys.map((key) => ({
        name: key,
        value: key
      }))
    }
  ])
  .then((result) => {
    commands[result.cmd]();
  });
