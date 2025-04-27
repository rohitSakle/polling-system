"use strict";
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

// Object to hold db and models
const db = {};

// Authenticate DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
  } catch (error) {
    console.error("Failed to connect DB:", error);
  }
})();

// Store Sequelize and sequelize instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models
db.poll = require("./poll")(sequelize, DataTypes);
db.vote = require("./vote")(sequelize, DataTypes);

// Models association
db.poll.hasMany(db.vote, { foreignKey: "pollId" });
db.vote.belongsTo(db.poll, { foreignKey: "pollId" });

module.exports = db;
