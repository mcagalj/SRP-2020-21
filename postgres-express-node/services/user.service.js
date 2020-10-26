class UserService {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  async getAllUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  getUser() {}
  createUser() {}
  updateUser() {}
  deleteUser() {}
}

module.exports = UserService;
