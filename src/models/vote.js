"use strict";

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const vote = sequelize.define(
    "vote",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Auto-increment primary key
        primaryKey: true,
        allowNull: false,
      },
      pollId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "poll",
          key: "id",
        },
      },
      options: {
        type: DataTypes.STRING, // 👈 ENUM field
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "vote",
      timestamps: true,
    }
  );
  return vote;
};
