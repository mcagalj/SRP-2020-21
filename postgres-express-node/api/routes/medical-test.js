const express = require("express");
const router = express.Router();

const MedicalTestSchemas = require("./medical-test.schemas");
const SchemaValidator = require("../middleware/validate");
const MedicalTestController = require("../controllers/medical-test.controller");

SchemaValidator.addSchemas(MedicalTestSchemas);

module.exports = (rootRouter) => {
  rootRouter.use("/", router);

  router.get("/tests", MedicalTestController.getTests);
  router.get("/tests/:id(\\d+)", MedicalTestController.getTestsByUser);
  router.get(
    "/tests/query",
    SchemaValidator.validate("getTestQuery"),
    MedicalTestController.getTestQuery
  );

  router.post(
    "/test",
    SchemaValidator.validate("createTest"),
    MedicalTestController.createTest
  );

  router.delete("/test/:id(\\d+)", MedicalTestController.deleteTestById);
};
