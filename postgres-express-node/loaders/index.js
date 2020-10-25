const expressLoader = require("./express");
const sequelizeLoader = require("./sequelize");
const Logger = require("./logger");

module.exports = async ({ app }) => {
  await sequelizeLoader();
  Logger.info("Sequelize loaded (DB connected)");

  expressLoader({ app });
  Logger.info("Express loaded");
};
