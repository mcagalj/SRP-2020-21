"use strict";
const { Model } = require("sequelize");
const { fieldEncryption } = require("../services/sequelize-field-encrypt");

module.exports = (sequelize, DataTypes) => {
  class MedicalTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
    }
  }
  MedicalTest.init(
    {
      name: DataTypes.STRING,
      // result: DataTypes.STRING,
      result: fieldEncryption("result", {
        type: DataTypes.STRING,
        field: "result",
      }),
    },
    {
      sequelize,
      modelName: "MedicalTest",
    }
  );
  return MedicalTest;
};
