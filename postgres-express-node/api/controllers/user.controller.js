const { userServiceInstance } = require("../../services");

exports.getUsers = async (req, res) => {
  const users = await userServiceInstance.getAllUsers();
  res.json({ users });
};

exports.getUser = async (req, res) => {
  const { username } = req.body;
  const user = await userServiceInstance.getUser({ username });
  res.json({ user });
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await userServiceInstance.createUser({ username, password });
  res.json({ user });
};
