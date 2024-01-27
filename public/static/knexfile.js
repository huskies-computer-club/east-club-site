// knexfile.js

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: 'localhost',
      user: 'postgres',
      database: 'postgres',
      password: 'admin'
    },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "dbmigrations",
      directory: "./migrations",
    },
  },
};

