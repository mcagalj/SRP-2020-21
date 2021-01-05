class RoleService {
  constructor({ logger, roleModel }) {
    this.roleModel = roleModel;
    this.logger = logger;
  }

  async getRoles() {
    try {
      const roles = await this.roleModel.findAll();
      return roles;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }
}

module.exports = RoleService;
