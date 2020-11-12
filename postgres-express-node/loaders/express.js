const express = require("express");
const jwt = require("express-jwt");
const cors = require("cors");
const config = require("../config");
const rateLimiterMiddleware = require("../api/middleware/api-rate-limiter");
const routes = require("../api");
module.exports = ({ app, HttpLogger: logger }) => {
  //---------------------------
  // REGISTER MIDDLEWARE
  // (Remember that the order in
  //  which you use the middleware
  //  matters.)
  //---------------------------
  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(rateLimiterMiddleware);
  app.use(
    jwt({
      secret: config.jwt.secret,
      algorithms: config.jwt.algorithms,
    }).unless(config.jwt.exclude)
  );

  //---------------------------
  // LOAD/MOUNT API ROUTES
  // (path prefix e.g. /api)
  //---------------------------
  app.use(config.api.prefix, routes());

  //---------------------------
  // ERROR HANDLERS
  //---------------------------
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // ultimate error handler
  app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      err.status = 401;
      err.message = "Not authorized (invalid token)";
    }

    res.status(err.status || 500).json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });
  });
};
