// ! We use slower (JavaScript) implementation here for convenience;
// ! in production you should use faster C++ bcrypt binding.
const bcrypt = require("bcryptjs");
const config = require("../config");

class UserService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.findAll();
      return users;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async getUser(userDTO) {
    try {
      const user = await this.userModel.findOne({
        // * to include only some attributes use:
        // * attributes: ["username", "id"]
        where: userDTO,
      });
      return user;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async createUser(userDTO) {
    try {
      this.logger.info(`Hashing password for user "${userDTO.username}"`);
      const hashedPassword = await bcrypt.hash(
        userDTO.password,
        config.bcrypt.SALT_ROUNDS
      );

      const user = await this.userModel.create({
        ...userDTO,
        password: hashedPassword,
      });

      return user;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async updateUser(userDTO) {
    try {
      let user = await this.userModel.findOne({
        where: { id: userDTO.id },
      });

      if (!user) {
        throw new Error(`No user with id ${userDTO.id} found`);
      }

      const { id, password, ..._userDTO } = userDTO;

      if (password) {
        const hashedPassword = await bcrypt.hash(
          password,
          config.bcrypt.SALT_ROUNDS
        );

        _userDTO.password = hashedPassword;
      }

      user = user.update(_userDTO);
      return user;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

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
