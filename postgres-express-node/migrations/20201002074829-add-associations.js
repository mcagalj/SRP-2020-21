"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "MedicalTests", // name of the Source model/table
      "UserId", // name of the key to be added
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // name of the Target model/table
          key: "id", // key/field in the Target table
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "MedicalTests", // name of Source model
      "UserId" // key we want to remove
    );
  },
};
