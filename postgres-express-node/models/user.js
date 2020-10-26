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
          isUnique: async (username) => {
            const user = await User.findOne({ where: { username } });
            if (user) {
              throw new Error("Username already in use");
            }
          },
        },
      },
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
