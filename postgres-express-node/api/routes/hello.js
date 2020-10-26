const express = require("express");
const router = express.Router();

module.exports = (rootRouter) => {
  rootRouter.use("/", router);

  // handle requests to /api
  router.get("/", (req, res) => res.json({ message: "Hello there!" }));

  // handle requests to /api/hello
  router.get("/hello", (req, res) =>
    res.json({ message: "Hello there from /hello!" })
  );
};
