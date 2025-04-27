"use strict";
require("dotenv").config();
const http = require("http");
const setupSocket = require("./socket");

const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);
app.set("io", io);

const db = require("./models/index");

const PORT = process.env.PORT || 4001;

// Connect to database
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Failed to sync DB:", error);
  });

server.listen(PORT, () => {
  console.log(`listen on http://localhost:${PORT}`);
});
