const winston = require("winston");
const { Op } = require("sequelize");
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

exports.getTestQuery = async (req, res) => {
  const { query } = req.body;
  const { name, UserId } = query;
  try {
    if (name && UserId) {
      const tests = await medicalTestServiceInstance.getTestsByQuery({
        name: { [Op.like]: `${name}%` },
        UserId,
      });

      return res.json({ tests });
    }

    if (name) {
      const tests = await medicalTestServiceInstance.getTestsByQuery({
        name: { [Op.like]: `${name}%` },
      });
      return res.json({ tests });
    }

    if (UserId) {
      const tests = await medicalTestServiceInstance.getTestsByQuery({
        UserId,
      });
      return res.json({ tests });
    }

    res.json({ tests: [] });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.createTest = async (req, res) => {
  const { UserId, name, result, timestamp } = req.body;
  try {
    const test = await medicalTestServiceInstance.createTest({
      UserId,
      name,
      timestamp,
      // ! apparently, the value that we are setting using
      // ! a set() function (in our case "result" field) should appear
      // ! last in order to be able to read the other fields from
      // ! the model in the encryption computation using AES-GCM mode with AAD
      result,
    });
    res.status(201).json({ test });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.deleteTestById = async (req, res) => {
  const { id } = req.params;
  try {
    await medicalTestServiceInstance.deleteTest({ id });
    res.status(204).json({});
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};
