"use strict";

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("New client connected...");

    socket.on("joinPollRoom", (creatorId) => {
      const roomName = `poll-${creatorId}`;
      socket.join(roomName);
      console.log(`Client joined room: ${roomName}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected.");
    });
  });
}

module.exports = setupSocket;
