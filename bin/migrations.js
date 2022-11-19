#! /usr/bin/env node
require('dotenv/config');

const command = process.argv[2];
const migrationsDir = process.env.MIGRATIONS_DIR;

let commandRunner;
switch (command) {
  case 'execute':
  case 'run': {
    commandRunner = require('../src/execute');
    break;
  }
  case 'create': {
    commandRunner = require('../src/create');
    break;
  }
  case 'revert': {
    commandRunner = require('../src/revert');
    break;
  }
}

if (!commandRunner) throw new Error('Invalid migration command, try: run,create or revert');

commandRunner(migrationsDir).then(() => {
  process.exit(0);
});
