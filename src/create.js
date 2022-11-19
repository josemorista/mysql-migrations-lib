const path = require('path');
const { writeFileSync } = require('fs');

/**
 * @param {string} migrationsDir
 */
module.exports = async migrationsDir => {
  const migrationName = `${Date.now()}${process.argv[3]}.sql`;
  writeFileSync(path.join(migrationsDir, 'up', migrationName), '');
  writeFileSync(path.join(migrationsDir, 'down', migrationName), '');
};
