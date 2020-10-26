const express = require("express");
const router = express.Router();

const UsersSchemas = require("./user.schemas");
const SchemaValidator = require("../middleware/validate");
const UserController = require("../controllers/user.controller");

SchemaValidator.addSchemas(UsersSchemas);

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
};
