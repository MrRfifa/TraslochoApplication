const { hgetAsync, readHashValue } = require("../databases/redis");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (socket, next) => {
  const userId = socket.handshake.query.id;
  const secretKey = process.env.JWT_TOKEN;

  if (!userId) {
    console.error("Authentication error: Email not provided");
    return next(new Error("Authentication error: Email not provided"));
  }

  try {
    const cacheKey = `connected_${userId}`;
    const token = await readHashValue(cacheKey, "data");
    // console.log(token);

    if (!token) {
      console.error("Authentication error: Token not found");
      return next(new Error("Authentication error: Token not found"));
    }

    // Verify the token with the correct algorithm ('HS256')
    jwt.verify(token, secretKey, { algorithms: ["HS256"] }, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return next(new Error("Authentication error: Invalid token"));
      } else {
        // console.log("Token decoded:", decoded);

        // Attach token and user information to the socket for later use
        socket.userToken = token;
        socket.userId = userId;

        return next();
      }
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    return next(new Error("Authentication error: Internal server error"));
  }
};

module.exports = verifyToken;
