#! /usr/bin/env node

require('dotenv/config');

const { mkdirSync } = require('fs');
const { join } = require('path');

const migrationsDir = process.env.MIGRATIONS_DIR;

mkdirSync(join(migrationsDir, 'up'));
mkdirSync(join(migrationsDir, 'down'));
