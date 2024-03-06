const { Server } = require("socket.io");
const { initializeRedis, setWithTTLAsync } = require("../databases/redis");
const verifyToken = require("../Middleware/authMiddleware");
const Message = require("../Models/message");

const connectedUsers = new Map(); // Maintaining a list of connected users

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  initializeRedis();

  io.use(verifyToken);

  io.on("connection", (socket) => {
    console.log(`User with id ${socket.userId} connected.`);
    connectedUsers.set(socket.userId, socket.userId); // Add user to connectedUsers map
    // console.log(connectedUsers);
    // Emit event to update connected users list
    io.emit("updateConnectedUsers", Array.from(connectedUsers.keys()));

    // Joining a room
    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User with id: ${socket.userId} joined room ${room} `);
    });

    // Sending a message
    socket.on("send_message", async (data) => {
      const newMessage = new Message({
        contact: data.contact,
        sender: data.sender,
        content: data.content,
        time: data.time,
      });
      // Save the message to MongoDB
      await newMessage.save();

      // Emit event to notify recipient
      const recipientSocket = connectedUsers.get(data.contact);
      if (recipientSocket) {
        recipientSocket.emit("message_received", newMessage);
      }

      // Emit event to all sockets in the room
      io.to(data.contact).emit("receive_message", data);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected");
      connectedUsers.delete(socket.userId); // Remove user from connectedUsers map
      // Emit event to update connected users list
      io.emit("updateConnectedUsers", Array.from(connectedUsers.keys()));
    });
  });
};

module.exports = initializeSocket;
