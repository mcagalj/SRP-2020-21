const expressLoader = require("./express");
const sequelizeLoader = require("./sequelize");
const { Logger, HttpLogger } = require("./logger");

module.exports = async ({ app }) => {
  await sequelizeLoader({ Logger });
  Logger.info("Sequelize loaded (DB connected)");

  expressLoader({ app, HttpLogger, Logger });
  Logger.info("Express app loaded");
};
