const winston = require("winston");
const { roleServiceInstance } = require("../../services");

const Logger = winston.loggers.get("logger");

exports.getRoles = async (req, res) => {
  try {
    const roles = await roleServiceInstance.getRoles();
    res.json({ roles });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};
