class UserService {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  async getAllUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUser({ username }) {
    const user = await this.userModel.findOne({
      // * to include only some attributes use:
      // * attributes: ["username", "id"]
      where: { username },
    });
    return user;
  }

  createUser() {}
  updateUser() {}
  deleteUser() {}
}

module.exports = UserService;
