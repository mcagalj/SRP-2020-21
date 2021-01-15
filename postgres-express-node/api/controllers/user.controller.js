const winston = require("winston");
const { ForbiddenError, subject } = require("@casl/ability");
const { userServiceInstance, roleServiceInstance } = require("../../services");
const { config } = require("winston");
const { defaultRole = "guest" } = require("../../config");
const Logger = winston.loggers.get("logger");

function isEmptyValue(value) {
  return value === undefined || value === null || value === NaN;
}

exports.getUsers = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("read", "Users");

  const users = await userServiceInstance.getAllUsers();
  res.json({ users });
};

exports.getUser = async (req, res) => {
  const { username } = req.body;
  const user = await userServiceInstance.getUser({ username });
  ForbiddenError.from(req.ability).throwUnlessCan("read", user);

  res.json({ user });
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  const roles = await roleServiceInstance.getRoles();
  const roleRecord = roles.find((role) => role.name === defaultRole);
  const user = await userServiceInstance.createUser({
    username,
    password,
    roleId: roleRecord.dataValues.id,
  });
  res.status(201).json({ user });
};

exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, password, roleId = null } = req.body;

  const user = !isEmptyValue(roleId)
    ? subject("User", { id, username, password, roleId })
    : subject("User", { id, username, password });

  !isEmptyValue(username) &&
    ForbiddenError.from(req.ability).throwUnlessCan("update", user, "username");

  !isEmptyValue(password) &&
    ForbiddenError.from(req.ability).throwUnlessCan("update", user, "password");

  !isEmptyValue(roleId) &&
    ForbiddenError.from(req.ability).throwUnlessCan("update", user, "roleId");

  const userRecord = await userServiceInstance.updateUser(user);
  res.json({ user: userRecord });
};

exports.deleteUser = async (req, res) => {
  const { username } = req.body;
  const user = await userServiceInstance.getUser({ username });
  ForbiddenError.from(req.ability).throwUnlessCan(
    "delete",
    subject("User", user)
  );

  await userServiceInstance.deleteUser({ username });
  res.status(204).json({});
};

exports.deleteUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  ForbiddenError.from(req.ability).throwUnlessCan(
    "delete",
    subject("User", { id })
  );

  await userServiceInstance.deleteUser({ id });
  res.status(204).json({});
};
