const redis = require("ioredis");
const { promisify } = require("util");
require("dotenv").config();

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
  host: redisHost,
  port: redisPort,
});

client.on("error", (err) => console.error("Redis Client Error", err));

const getAsync = promisify(client.get).bind(client);
const hgetAsync = promisify(client.hget).bind(client);
const setAsync = promisify(client.set).bind(client);

const initializeRedis = () => {
  // Add any additional setup for Redis if needed
  console.log("Connected to Redis");
};

const readHashValue = async (hashKey, field) => {
  try {
    const value = await hgetAsync(hashKey, field);
    // console.log(value);
    return value;
    // console.log(JSON.parse(value));
  } catch (error) {
    console.error("Error:", error);
  }
  //   finally {
  //     // Disconnect from Redis after using the value
  //     client.quit();
  //   }
};

const setWithTTLAsync = async (key, value, ttlInSeconds) => {
    await setAsync(key, value, 'EX', ttlInSeconds);
  };

module.exports = {
  initializeRedis,
  client,
  getAsync,
  hgetAsync,
  readHashValue,
  setWithTTLAsync
};
