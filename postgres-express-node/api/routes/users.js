const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");

module.exports = (rootRouter) => {
  rootRouter.use("/users", router);

  //   router.get("/", (req, res) => res.json({ message: "Users" }));
  router.get("/", UserController.getUsers);
};
