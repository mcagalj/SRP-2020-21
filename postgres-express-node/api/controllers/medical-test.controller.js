const winston = require("winston");
const { Op } = require("sequelize");
const { ForbiddenError, subject } = require("@casl/ability");
const { medicalTestServiceInstance } = require("../../services");
const logger = winston.loggers.get("logger");

exports.getTests = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan(
    "read",
    subject("MedicalTest", { UserId: true })
  );

  const tests = await medicalTestServiceInstance.getAllTests();
  res.json({ tests });
};

exports.getTestsByUser = async (req, res) => {
  const { id } = req.params;

  ForbiddenError.from(req.ability).throwUnlessCan(
    "read",
    subject("MedicalTest", { UserId: parseInt(id) })
  );

  const tests = await medicalTestServiceInstance.getAllTestsByUser({
    UserId: id,
  });
  res.json({ tests });
};

exports.getTestQuery = async (req, res) => {
  const { query } = req.body;
  const { name, UserId } = query;

  ForbiddenError.from(req.ability).throwUnlessCan(
    "read",
    subject("MedicalTest", { UserId })
  );

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
};

exports.createTest = async (req, res) => {
  const { UserId, name, result, timestamp } = req.body;

  ForbiddenError.from(req.ability).throwUnlessCan(
    "create",
    subject("MedicalTest", { UserId })
  );

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
};

exports.deleteTestById = async (req, res) => {
  const { id } = req.params;
  const medicalTest = await medicalTestServiceInstance.getTestsByQuery({
    id: { [Op.eq]: id },
  });

  ForbiddenError.from(req.ability).throwUnlessCan(
    "delete",
    subject("MedicalTest", medicalTest)
  );

  await medicalTestServiceInstance.deleteTest({ id });
  res.status(204).json({});
};
