const express = require("express");
const router = express.Router();

const MedicalTestSchemas = require("./medical-test.schemas");
const SchemaValidator = require("../middleware/validate");
const UserController = require("../controllers/medical-test.controller");

SchemaValidator.addSchemas(MedicalTestSchemas);

module.exports = (rootRouter) => {
  rootRouter.use("/", router);

  router.get("/tests", UserController.getTests);
  router.get("/tests/:id", UserController.getTestsByUser);

  //   router.get(
  //     "/user",
  //     SchemaValidator.validate("getUser"),
  //     UserController.getUser
  //   );

  //   router.post(
  //     "/user",
  //     SchemaValidator.validate("createUser"),
  //     UserController.createUser
  //   );

  //   router.put(
  //     "/user/:id",
  //     SchemaValidator.validate("updateUser"),
  //     UserController.updateUser
  //   );

  //   router.delete(
  //     "/user",
  //     SchemaValidator.validate("deleteUser"),
  //     UserController.deleteUser
  //   );

  //   router.delete("/user/:id", UserController.deleteUserById);
};
