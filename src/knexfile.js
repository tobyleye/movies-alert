// Update with your config settings.
import { dbConfig } from "./config.js";
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "mysql2",
    connection: {
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
