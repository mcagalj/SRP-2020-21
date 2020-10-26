const express = require("express");
const cors = require("cors");
const config = require("../config");
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
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
