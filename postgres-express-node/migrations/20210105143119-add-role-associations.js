"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Users", // name of the Source model/table
      "roleId", // name of the key to be added
      {
        type: Sequelize.INTEGER,
        references: {
          model: "Roles", // name of the Target model/table
          key: "id", // key/field in the Target table
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "Users", // name of Source model
      "roleId" // key we want to remove
    );
  },
};
