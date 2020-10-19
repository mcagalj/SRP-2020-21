"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "MedicalTests", // name of the Source model/table
      "timestamp", // name of the key to be added
      {
        type: Sequelize.DATE,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "MedicalTests", // name of Source model
      "timestamp" // key we want to remove
    );
  },
};
