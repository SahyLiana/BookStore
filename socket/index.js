const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {},
});

let users = [];

const addUsers = (socketId, userId) => {
  console.log("add users");
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUsers = (socketId) => {
  console.log("remove users");
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("An user is connected", socket.id);

  io.emit("connected", socket.id);

  socket.on("addUsers", (userId) => {
    addUsers(socket.id, userId);
    io.emit("users", users);
    console.log(users);
  });

  socket.on("myConversation", (conversation) => {
    console.log("My selected conversation", conversation);
    io.emit("getConversation", conversation);
  });

  socket.on("disconnect", () => {
    console.log("Socket id disconnected", socket.id);
    removeUsers(socket.id);
    console.log(users);
    io.emit("users", users);
  });
});

const PORT = 3002;
server.listen(PORT, () => console.log("Server is listening on port 3002"));
