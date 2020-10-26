const config = require("./config");
const express = require("express");
const { Logger } = require("./loaders/logger");
const loaders = require("./loaders");

async function startServer() {
  const app = express();

  Logger.info("Starting the loader...");
  await loaders({ app });

  Logger.info("Starting the server...");
  app
    .listen(config.port, () => {
      Logger.info(
        `>>> Server is ready and listening on port: ${config.port} <<<`
      );
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
