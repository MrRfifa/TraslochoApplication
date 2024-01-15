const { Server } = require("socket.io");
const { initializeRedis, setWithTTLAsync } = require("../databases/redis");
const verifyToken = require("../Middleware/authMiddleware");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  initializeRedis();

  io.use(verifyToken);

  io.on("connection", (socket) => {
    console.log(`User with email ${socket.userEmail} connected.`);
    // console.log(socket.userEmail);
    setWithTTLAsync(
      `user_email_${socket.userEmail}`,
      socket.userEmail,
      45 * 60
    );

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with email: ${socket.userEmail} joined room ${data} `);
    });

    socket.on("send_message", async (data) => {
      // Example Redis Usage
      // ...
      // Example MongoDB Usage
      // ...
      // console.log(data);
      socket.to(data.room).emit("receive_message", data);
      // socket.broadcast.emit("receive_message", data);
    });
  });
};

module.exports = initializeSocket;
