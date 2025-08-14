const Redis = require("ioredis");

const connect = async (url, extras, port) => {
  let redis = new Redis({
    host: url,
    port: port,
    reconnectOnError(err) {
      const targetError = "READONLY";
      if (err.message.includes(targetError)) {
        // Only reconnect when the error contains "READONLY"
        return true; // or `return 1;`
      }
    },
    maxRetriesPerRequest: 100000000000000,
    ...extras,
    retryStrategy: (times) => {
      // Reconnect after 3 seconds (adjust as needed)
      return 500;
    },
  });

  redis.on("error", (error) => {
    console.error(`Redis error: ${error.message}`);
  });
  redis.on("disconnect", async () => {
    console.log("Disconnected from Redis");
    redis.connect();
    // Handle reconnection or other logic here
  });
  await new Promise((resolve) => {
    redis.on("connect", () => {
      console.log("connected to redis ");
      resolve();
    });
  });
  return redis;
};
const redisClient = { connect };
module.exports = { redisClient };
