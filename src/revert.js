const path = require('path');
const fs = require('fs/promises');
const { createConnection } = require('mysql2/promise');

module.exports = async migrationsDir => {
  const migrationsPath = path.join(migrationsDir, 'down');

  const client = await createConnection({
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
  });
  try {
    const [rows] = await client.query('select * from Migrations order by name desc limit 1;');

    if (rows.length === 0) {
      console.log('No migrations to revert');
      return;
    }

    const sql = (await fs.readFile(path.join(migrationsPath, `${rows[0].name}.sql`), { encoding: 'utf-8' }))
      .replace(/\n|\t/g, '')
      .split(';');

    await client.beginTransaction();
    try {
      for (const query of sql) {
        const trimmed = query.trim();
        if (trimmed.length) {
          console.log(trimmed);
          await client.execute(trimmed);
        }
      }
      await client.query('delete from Migrations where name like ?;', [rows[0].name]);
      await client.commit();
      console.log(`\n* Reverted ${rows[0].name}\n`);
    } catch (error) {
      console.error(error);
      await client.rollback();
    }
  } finally {
    await client.end();
  }
};
