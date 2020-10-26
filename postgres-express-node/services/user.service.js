class UserService {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  async getAllUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUser(userDTO) {
    const user = await this.userModel.findOne({
      // * to include only some attributes use:
      // * attributes: ["username", "id"]
      where: userDTO,
    });
    return user;
  }

  async createUser(userDTO) {
    const user = await this.userModel.create(userDTO);
    return user;
  }

  updateUser() {}
  deleteUser() {}
}

module.exports = UserService;
