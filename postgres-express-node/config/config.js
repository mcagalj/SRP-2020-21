const dotenv = require("dotenv");
const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

const Logger = require("../loaders/logger");

/**
 * Sequelize config
 */
module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: (msg) => Logger.info(`Sequelize: ${msg}`),
  },

  production: {
    use_env_variable: "DATABASE_URL",
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: (msg) => Logger.info(`Sequelize: ${msg}`),
  },
};
