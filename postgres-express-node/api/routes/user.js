const express = require("express");
const router = express.Router();

const UserSchemas = require("./user.schemas");
const SchemaValidator = require("../middleware/validate");
const UserController = require("../controllers/user.controller");

SchemaValidator.addSchemas(UserSchemas);

module.exports = (rootRouter) => {
  rootRouter.use("/", router);

  router.get("/users", UserController.getUsers);

  router.get(
    "/user",
    SchemaValidator.validate("getUser"),
    UserController.getUser
  );

  router.post(
    "/user",
    SchemaValidator.validate("createUser"),
    UserController.createUser
  );

  router.put(
    "/user/:id(\\d+)",
    SchemaValidator.validate("updateUser"),
    UserController.updateUser
  );

  router.delete(
    "/user",
    SchemaValidator.validate("deleteUser"),
    UserController.deleteUser
  );

  router.delete("/user/:id(\\d+)", UserController.deleteUserById);
};
