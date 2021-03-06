'use strict';

const chalk = require('chalk');
const path = process.env.GIT_PARAMS;
const fs = require('fs');
const commitMessage = fs.readFileSync(path, 'utf-8').trim();

const REG_EXP = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

if (!REG_EXP.test(commitMessage)) {
  console.error(
    `${chalk.bgRedBright.white('ERROR')} : '${chalk.bgYellow(
      commitMessage,
    )}' ${chalk.red(`is an invalid commit message format.`)}`,
  );

  process.exit(1);
}
