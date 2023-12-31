// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();
// //redis test
// const redis = require("ioredis");

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// const mdbConnect = process.env.MONGO_URI;

// mongoose
//   .connect(mdbConnect)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
// });

// server.listen(port, () => {
//   console.log(`Server running on port: ${port}`);
// });

// io.on("connection", (socket) => {
//   console.log(`A user connected: ${socket.id}`);

//   socket.on("send_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   });
// });

// let redisClient;

// (async () => {
//   redisClient = new redis();

//   redisClient.on("error", (error) => console.error(`Error : ${error}`));

//   // await redisClient.connect();
//   console.log("redis is connected");
// })();

// // redisClient.set("random_key1111", "random_value");
// // Use it in an async function
// async function yourFunction() {
//   try {
//     const value = await redisClient.hget("vehicle-1", "data");
//     console.log(JSON.parse(value).Model);
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     // Disconnect from Redis after using the value
//     redisClient.quit();
//   }
// }

// yourFunction();

const express = require("express");
const http = require("http");
const cors = require("cors");
const initializeMongo = require("./databases/mongodb");
// const { client, getAsync, setAsync } = require("./databases/redis");
const initializeSocket = require("./Helpers/socket");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);
// Initialize MongoDB
initializeMongo();

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
