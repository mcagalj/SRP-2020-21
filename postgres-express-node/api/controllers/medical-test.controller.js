const winston = require("winston");
const { medicalTestServiceInstance } = require("../../services");

const Logger = winston.loggers.get("logger");

exports.getTests = async (req, res) => {
  try {
    const tests = await medicalTestServiceInstance.getAllTests();
    res.json({ tests });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.getTestsByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const tests = await medicalTestServiceInstance.getAllTestsByUser({
      UserId: id,
    });
    res.json({ tests });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};
