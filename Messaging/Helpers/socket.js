const { Server } = require("socket.io");
const { initializeRedis, setWithTTLAsync } = require("../databases/redis");
const verifyToken = require("../Middleware/authMiddleware");
const Message = require("../Models/message");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  initializeRedis();

  io.use(verifyToken);

  io.on("connection", (socket) => {
    console.log(`User with id ${socket.userId} connected.`);
    // console.log(socket.userId);
    setWithTTLAsync(`user_id_${socket.userId}`, socket.userId, 45 * 60);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with id: ${socket.userId} joined room ${data} `);
    });

    socket.on("send_message", async (data) => {
      const newMessage = new Message({
        contact: data.contact,
        sender: data.sender,
        content: data.content,
        time: data.time,
      });
      // Save the message to MongoDB
      await newMessage.save();
      socket.to(data.contact).emit("receive_message", data);
      // socket.broadcast.emit("receive_message", data);
    });

    socket.on("disconnect", async () => {
      console.log("user diconnected");
    });
  });
};

module.exports = initializeSocket;
