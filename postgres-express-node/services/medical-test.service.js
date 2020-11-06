class MedicalTestService {
  constructor({ logger, testModel }) {
    this.testModel = testModel;
    this.logger = logger;
  }

  async getAllTests() {
    try {
      const tests = await this.testModel.findAll();
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

  async getTestsByQuery(queryDTO) {
    try {
      const tests = await this.testModel.findAll({ where: queryDTO });
      return tests;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async createTest(testDTO) {
    try {
      const test = await this.testModel.create(testDTO);
      return test;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async deleteTest(testDTO) {
    try {
      await this.testModel.destroy({ where: testDTO });
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }
}

module.exports = MedicalTestService;
