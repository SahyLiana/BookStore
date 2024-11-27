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
let allConversations = [];

const addUsers = (socketId, userId) => {
  console.log("add users", socketId, userId);
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

  socket.on("allConversations", (conversations) => {
    console.log("All conversations from socket", conversations);
    allConversations = [...conversations];
  });

  socket.on("myConversation", (conversation) => {
    console.log("My selected conversation", conversation);
    io.emit("getConversation", conversation);
  });

  socket.on("sentMessage", (conversationMsg) => {
    console.log("My conversation message", conversationMsg, allConversations);
    const findUserConversation = allConversations.find(
      (conversation) => conversation._id === conversationMsg._id
    );

    if (findUserConversation) {
      // findUserConversation.messages.push(conversationMsg);
      console.log("Found conversation", conversationMsg);
      allConversations = allConversations.map((conversation) =>
        conversation._id === findUserConversation._id
          ? conversationMsg
          : conversation
      );

      const findConnectedUser = users.find(
        (user) => user.userId === conversationMsg.receiverId
      );

      if (findConnectedUser) {
        console.log(
          "User with id found",
          conversationMsg.receiverId,
          findConnectedUser
        );

        io.to(findConnectedUser.socketId).emit(
          "getMessage",
          // "Message get"
          {
            conversationId: conversationMsg._id,
            message:
              conversationMsg.messages[conversationMsg.messages.length - 1],
          }
        );
      } else {
        console.log("Not found");
      }

      // console.log("All conversations are", allConversations);
    }
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
