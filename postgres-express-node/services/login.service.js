class LoginService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async getUser(userDTO) {
    const user = await this.userModel.findOne({
      where: userDTO,
    });
    return user;
  }
}

module.exports = LoginService;
