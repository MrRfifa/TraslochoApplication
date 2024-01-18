const express = require("express");
const http = require("http");
const cors = require("cors");
const initializeMongo = require("./databases/mongodb");
// const { client, getAsync, setAsync } = require("./databases/redis");
const initializeSocket = require("./Helpers/socket");
const contactRouter = require("./Routers/contactRouter");
const messageRouter = require("./Routers/messageRouter");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/contacts", contactRouter);
app.use("/messages", messageRouter);

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);
// Initialize MongoDB
initializeMongo();

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
