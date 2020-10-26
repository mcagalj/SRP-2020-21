const express = require("express");
const router = express.Router();

const HelloController = require("../controllers/hello.controller");

module.exports = (rootRouter) => {
  rootRouter.use("/", router);

  router.get("/", HelloController.sayHello);
};
