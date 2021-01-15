const winston = require("winston");
const { ForbiddenError, subject } = require("@casl/ability");
const { roleServiceInstance } = require("../../services");

const Logger = winston.loggers.get("logger");

exports.getRoles = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("read", "Roles");
  const roles = await roleServiceInstance.getRoles();
  res.json({ roles });
};
