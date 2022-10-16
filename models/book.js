'use strict';
const {
  Model
} = require('sequelize');
const { MODEL_NAME_BOOK } = require('../constants/db/MODEL_NAMES')
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.belongsTo(models.Author)
    }
  }
  Book.init({
    title: DataTypes.STRING,
    isbn: DataTypes.STRING,
    publishDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: MODEL_NAME_BOOK,
  });
  return Book;
};
