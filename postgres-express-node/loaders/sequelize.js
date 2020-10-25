const { sequelize } = require("../models");
const Logger = require("./logger");

async function assertDatabaseConnectionOk() {
  Logger.info("Checking database connection...");

  try {
    await sequelize.authenticate();
    Logger.info("Connection has been established successfully");
  } catch (error) {
    Logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

module.exports = () => assertDatabaseConnectionOk();
