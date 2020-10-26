class UserService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
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
    try {
      const user = await this.userModel.create(userDTO);
      return user;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  updateUser() {}

  async deleteUser(userDTO) {
    try {
      await this.userModel.destroy({ where: userDTO });
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }
}

module.exports = UserService;
