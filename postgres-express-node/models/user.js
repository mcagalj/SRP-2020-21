"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.MedicalTest);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        validate: {
          async isUnique(username) {
            const user = await User.findOne({ where: { username } });
            if (user) {
              throw new Error(`Username ${username} already in use`);
            }
          },
        },
      },
      password: DataTypes.STRING,
      roleId: {
        type: DataTypes.INTEGER,
        validate: {
          async roleExists(roleId) {
            const role = await sequelize.models.Role.findOne({
              where: { id: roleId },
            });
            if (!role) {
              throw new Error(`Specified role ${roleId} does not exist`);
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
