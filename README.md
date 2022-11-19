# MySQL migrations lib

Simple library to deal with migrations.

## Quick start

Define the following env variables:

```env
MIGRATIONS_DIR={{directory to read and write migrations}}
MYSQL_HOST={{host}}
MYSQL_PASSWORD={{password}}
MYSQL_PORT={{port}}
MYSQL_USER={{user}}
MYSQL_DATABASE={{database}}
```

Next run init script to prepare folder structure:

```bash
npx mysql-migrations:init
```

After initialized, the following commands are available:

```bash
npx mysql-migrations create {{nameOfTheMigrations}}
```

```bash
npx mysql-migrations run
```

```bash
npx mysql-migrations revert
```
