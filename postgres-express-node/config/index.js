const dotenv = require("dotenv");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

/**
 * Express app config
 */
module.exports = {
  port: process.env.PORT,

  // For winston logger
  logs: {
    level: process.env.LOG_LEVEL || "debug",
  },
};
