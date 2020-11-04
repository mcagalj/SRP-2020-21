const express = require("express");
const router = express.Router();

const LoginSchemas = require("./login.schemas");
const SchemaValidator = require("../middleware/validate");
const LoginController = require("../controllers/login.controller");

SchemaValidator.addSchemas(LoginSchemas);

module.exports = (rootRouter) => {
  rootRouter.use("/", router);

  router.post(
    "/login",
    SchemaValidator.validate("login"),
    LoginController.login
  );
};
