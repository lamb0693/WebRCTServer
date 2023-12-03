const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 3002;

io.on("connection", (socket) => {
  console.log(socket.id, "connection");

  socket.on("join_room", (data) => {
    console.log("join event", data)
    socket.broadcast.emit("joined")
  });

  socket.on("offer", (offer) => {
    console.log("offer event", offer)
    io.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    console.log("answer event", answer)
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice", (ice) => {
    console.log("ice event", ice)
    socket.broadcast.emit("ice", ice);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});