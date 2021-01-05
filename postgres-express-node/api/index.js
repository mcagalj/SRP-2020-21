const express = require("express");
const router = express.Router();

const hello = require("./routes/hello");
const login = require("./routes/login");
const user = require("./routes/user");
const medicalTest = require("./routes/medical-test");
const role = require("./routes/role");

module.exports = () => {
  hello(router);
  login(router);
  user(router);
  medicalTest(router);
  role(router);

  return router;
};
