const express = require("express");
const router = express.Router();

const hello = require("./routes/hello");
const login = require("./routes/login");
const user = require("./routes/user");
const medicalTest = require("./routes/medical-test");

module.exports = () => {
  hello(router);
  login(router);
  user(router);
  medicalTest(router);

  return router;
};
