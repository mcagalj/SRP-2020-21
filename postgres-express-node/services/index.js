const winston = require("winston");
const UserService = require("./user.service");
const { User } = require("../models");

const logger = winston.loggers.get("logger");

exports.userServiceInstance = new UserService({ logger, userModel: User });
