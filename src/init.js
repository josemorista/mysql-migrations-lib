const { mkdir, stat } = require('fs/promises');
const { join } = require('path');

/**
 * @param {string} migrationsDir
 */
module.exports = async migrationsDir => {
  const requiredDirectories = [join(migrationsDir, 'up'), join(migrationsDir, 'down')];
  for (const dir of requiredDirectories) {
    try {
      await stat(dir);
    } catch (error) {
      await mkdir(dir);
    }
  }
};
