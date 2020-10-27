const winston = require("winston");
const { userServiceInstance } = require("../../services");

const Logger = winston.loggers.get("logger");

exports.getUsers = async (req, res) => {
  try {
    const users = await userServiceInstance.getAllUsers();
    res.json({ users });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.getUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await userServiceInstance.getUser({ username });
    res.json({ user });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userServiceInstance.createUser({ username, password });
    res.json({ user });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    const user = await userServiceInstance.updateUser({
      id,
      username,
      password,
    });
    res.json({ user });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.deleteUser = async (req, res) => {
  const { username } = req.body;
  try {
    await userServiceInstance.deleteUser({ username });
    res.status(204).json({});
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    await userServiceInstance.deleteUser({ id });
    res.status(204).json({});
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};
