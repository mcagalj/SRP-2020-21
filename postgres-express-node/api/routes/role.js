const express = require("express");
const router = express.Router();

const RoleController = require("../controllers/role.controller");

module.exports = (rootRouter) => {
  rootRouter.use("/", router);

  router.get("/roles", RoleController.getRoles);
};
