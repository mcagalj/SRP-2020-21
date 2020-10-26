const { userServiceInstance } = require("../../services");

exports.getUsers = async (req, res) => {
  const users = await userServiceInstance.getAllUsers();
  res.json({ users });
};
