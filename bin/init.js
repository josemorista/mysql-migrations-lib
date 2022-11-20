#! /usr/bin/env node

require('dotenv/config');

const { mkdirSync, statSync } = require('fs');
const { join } = require('path');

const migrationsDir = process.env.MIGRATIONS_DIR;

try {
  statSync(join(migrationsDir, 'up'));
} catch (error) {
  mkdirSync(join(migrationsDir, 'up'));
}

try {
  statSync(join(migrationsDir, 'down'));
} catch (error) {
  mkdirSync(join(migrationsDir, 'down'));
}
