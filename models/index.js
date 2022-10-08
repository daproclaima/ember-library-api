'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const NotFoundError = require('../errors/not-found')
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/db.js'))[env];
const db = {};
let sequelize

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  const Model = db[modelName]

  if (Model.associate) {
    Model.associate(db);
  }

  Model.findOrFail = async (params) => {
    let model = await Model.findOne(params)

    if(model === null) {
      const id = params.where.id
      throw new NotFoundError(modelName, id)
    }

    return model
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
