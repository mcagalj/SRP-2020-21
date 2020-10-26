const express = require("express");
const router = express.Router();

const hello = require("./routes/hello");
const users = require("./routes/users");

module.exports = () => {
  hello(router);
  users(router);

  return router;
};
