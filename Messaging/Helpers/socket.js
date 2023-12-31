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

    socket.on("send_message", async (data) => {
      // Example Redis Usage
      // ...
      // Example MongoDB Usage
      // ...

      socket.broadcast.emit("receive_message", data);
    });
  });
};

module.exports = initializeSocket;
