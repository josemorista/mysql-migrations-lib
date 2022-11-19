const fs = require('fs/promises');
const path = require('path');
const { createConnection } = require('mysql2/promise');

/**
 * @param {string} migrationsDir
 */
module.exports = async migrationsDir => {
  const migrationsPath = path.join(migrationsDir, 'up');

  const client = await createConnection({
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    await client.query(`create table if not exists Migrations (
		name varchar(255) unique not null,
		createdAt timestamp not null default current_timestamp
	) default charset=UTF8MB4;`);

    const migrations = await fs.readdir(migrationsPath);

    for (const migration of migrations) {
      const migrationName = migration.split('.sql')[0];
      const [rows] = await client.query('select * from Migrations where name like ?;', [migrationName]);

      if (rows.length === 0) {
        await client.beginTransaction();
        try {
          const sql = (await fs.readFile(path.join(migrationsPath, migration), { encoding: 'utf-8' }))
            .replace(/\n|\t/g, '')
            .split(';');
          for (const query of sql) {
            const trimmed = query.trim();
            if (trimmed.length) {
              console.log(trimmed);
              await client.execute(trimmed);
            }
          }
          console.log(`\n* Executed ${migrationName}\n`);
          await client.query('insert ignore into Migrations(name) values(?);', [migrationName]);
          await client.commit();
        } catch (error) {
          console.error('Rolling back');
          await client.rollback();
          throw error;
        }
      }
    }
  } finally {
    await client.end();
  }
};
