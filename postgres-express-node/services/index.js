const winston = require("winston");
const UserService = require("./user.service");
const MedicalTestService = require("./medical-test.service");
const { User, MedicalTest } = require("../models");

const logger = winston.loggers.get("logger");

exports.userServiceInstance = new UserService({ logger, userModel: User });
exports.medicalTestServiceInstance = new MedicalTestService({
  logger,
  testModel: MedicalTest,
});
