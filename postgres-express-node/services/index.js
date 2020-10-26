/**
 * Services to be used in controllers
 */
const UserService = require("./user.service");

/**
 * Models consumed by services
 */
const { User } = require("../models");

exports.userServiceInstance = new UserService({ userModel: User });
