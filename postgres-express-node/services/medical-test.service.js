class MedicalTestService {
  constructor({ logger, testModel }) {
    this.testModel = testModel;
    this.logger = logger;
  }

  async getAllTests() {
    try {
      const tests = await this.testModel.findAll({
        // * to include only some attributes use:
        // * attributes: ["id", "name", "result", ...]
      });
      return tests;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async getAllTestsByUser(userDTO) {
    try {
      const tests = await this.testModel.findAll({ where: userDTO });
      return tests;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }
}

module.exports = MedicalTestService;
