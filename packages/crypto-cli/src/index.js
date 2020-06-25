import inquirer from 'inquirer';
import { Commands as commands } from './cmds';

const keys = Object.keys(commands);

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
