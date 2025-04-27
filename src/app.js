"use strict";
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const { pollRoutes, voteRoutes } = require("../src/routes");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
  req.io = app.get("io");
  next();
});

app.use("/api/v1/", pollRoutes);
app.use("/api/v1/", voteRoutes);

module.exports = app;
