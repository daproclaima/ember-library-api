"use strict";
const { Model } = require("sequelize");
const { MODEL_NAME_AUTHOR } = require("../constants/db/MODEL_NAMES");
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Author.hasMany(models.Book, { as: "books" });
    }
  }
  Author.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: MODEL_NAME_AUTHOR,
    }
  );
  return Author;
};
