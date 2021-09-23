import inquirer from 'inquirer';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

export default () => {
  inquirer
    .prompt([
      {
        type: 'string',
        name: 'secret',
        message: 'enter a secret to encrypt',
        required: true
      },
      {
        type: 'string',
        name: 'salt',
        message: 'enter the salt',
        required: true
      }
    ])
    .then((answer) => {
      console.log(crypt(answer.salt, answer.secret));
    });
};

const crypt = (salt, text) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
};
