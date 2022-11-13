"use strict";
const { Model } = require("sequelize");
const NotFoundError = require('../errors/not-found')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          unique(value) {
            const count = User.count({
              where: {
                email: value,
              },
            });

            if (count > 0) {
              throw new Error("email has already been taken");
            }
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          unique(value) {
            const count = User.count({
              where: {
                username: value,
              },
            });

            if (count > 0) {
              throw new Error("username has already been taken");
            }
          },
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.VIRTUAL,
        validate: {
          notEmpty: true,
          confirm(value) {
            if (value !== this.passwordConfirmation)
              throw new Error("password does not match confirmation");
          },
        },
      },
      passwordConfirmation: {
        type: DataTypes.VIRTUAL,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.findByEmail = async email => {
    const user = await User.findOne({
      where: { email }
    })

    if(!user) throw new NotFoundError()

    return user
  }
  return User;
};
