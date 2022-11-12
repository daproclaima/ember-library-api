"use strict";
const { TABLE_NAME_BOOKS } = require("../constants/db/TABLE_NAMES");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reviews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user: {
        type: Sequelize.STRING,
      },
      body: {
        type: Sequelize.STRING,
      },
      BookId: {
        type: Sequelize.INTEGER,
        references: {
          model: TABLE_NAME_BOOKS,
          key: "id",
          onDelete: "cascade",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reviews");
  },
};
