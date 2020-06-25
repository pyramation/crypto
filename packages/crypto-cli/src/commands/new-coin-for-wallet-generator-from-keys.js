import { infoForWalletNet } from '@pyramation/crypto-keys';
import inquirer from 'inquirer';

export default () => {
  inquirer
    .prompt([
      {
        type: 'string',
        name: 'publicKey',
        message: 'enter a public key',
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
      const info = infoForWalletNet(answer.publicKey, answer.privateKey);
      console.log(info.message);
      console.log('similar coins:');
      console.log(info.similar.join(','));
    });
};
