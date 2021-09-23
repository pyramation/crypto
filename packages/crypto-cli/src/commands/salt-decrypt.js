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
        name: 'str',
        message: 'enter a string to decrypt',
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
      console.log(decrypt(answer.salt, answer.str));
    });
};

const decrypt = (salt, encoded) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join('');
};
