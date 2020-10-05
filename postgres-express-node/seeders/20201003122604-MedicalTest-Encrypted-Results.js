const { QueryTypes } = require("sequelize");
const { encrypt } = require("../services/sequelize-field-encrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Example of seeding with associations
     */

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM public."Users"',
      {
        type: QueryTypes.SELECT,
      }
    );

    const dummy_tests = users.map((user) => {
      let result = user.id % 2 === 0 ? "positive" : "negative";
      return {
        name: "Covid-19",
        result: encrypt({
          key: Buffer.from(process.env.DB_FIELD_ENC_KEY, "base64"),
          plaintext: result,
        }),
        UserId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return await queryInterface.bulkInsert("MedicalTests", dummy_tests);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("MedicalTests", null, {});
  },
};
