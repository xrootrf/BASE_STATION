const { redisClient } = require("./redis");
const { rest_server } = require("./rest_server");
const { SocketIOClient } = require("./socket_client");
// const { SocketIoServer } = require("./socket_server");
const dotenv = require("dotenv");
const axios = require("axios");
const RabbitMQ = require("./rabbitmq");
const { rabbitMQClient } = require("./rabbitmqClient/client");

dotenv.config();

const init = async () => {
  // Socket.IO options with the 'reconnect' option set to true
  await rabbitMQClient.initialize();

  let droneIds = [];
  try {
    const dronesResp = await axios.get(`${process.env.DRONES_URL}/getdrones`);
    if (dronesResp.data.length > 0) {
      droneIds = dronesResp.data.map((drone) => {
        return drone.id;
      });
    }
    console.log(droneIds);
  } catch (err) {
    console.log(err);
  }

  const socketOptions = {
    path: "/ws/droneingest",
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    extraHeaders: {
      type: "base",
      baseid: "6384a26eeb99ea2bf400d32f",
      pass: "123123",
    },
    //   reconnectionDelay: 500,
    //   timeout: 1000,
  };
  console.log(process.env.DRONEINGEST_API);
  const socketClient = new SocketIOClient(
    process.env.DRONEINGEST_API,
    socketOptions
  );
  const redisPersonalPub = await redisClient.connect(
    process.env.REDIS_HOST,
    {},
    process.env.REDIS_PORT
  );
  const rabbitmq = new RabbitMQ(
    process.env.SERVER_IP,
    process.env.RABBIT_MQ_PORT,
    droneIds,
    socketClient,
    redisPersonalPub
    // ["hello"]
  );
  let rabbitConnected = false;
  while (!rabbitConnected) {
    try {
      const connected = await rabbitmq.connect();
      if (connected) {
        await rabbitmq.createqueuesNames();
        rabbitConnected = true;
      }
    } catch (err) {
      console.log("retrying to connect rabbit ");
      console.log("retrying to connect rabbit ");
      // console.log(err);
    }
  }

  console.log("===================================");
  console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);
  const redisPersonalSubs = await redisClient.connect(
    process.env.REDIS_HOST,
    {},
    process.env.REDIS_PORT
  );
  // const redisPersonalXRead = await redisClient.connect(
  //   process.env.REDIS_HOST,
  //   {},
  //   process.env.REDIS_PORT
  // );

  // const redisAppXadd = await redisClient.connect(
  //   "0.0.0.0",
  //   { password: "Bazinga247" },
  //   6379

  redisPersonalSubs.subscribe("api_drone_responses");
  // redisPersonalSubs.subscribe("rtcmdata");
  redisPersonalSubs.subscribe("droneTelem");
  // Create an instance of the SocketIOClient class

  // const socketServer = new SocketIoServer(
  //   rest_server,
  //   redisPersonalPub,
  //   redisAppPub,
  //   socketClient,
  //   rabbitmq
  // );

  // await new Promise((resolve) => {
  //   redisPersonalXRead.xtrim("metadata", "MINID", 0, (err) => {
  //     if (err) {
  //       console.error("Error trimming stream:", err);
  //     } else {
  //       console.log(`Trimmed stream "metadata"`);
  //     }
  //     resolve();
  //   });
  // });
  redisPersonalSubs.on("message", async (channel, data) => {
    if (channel === "api_drone_responses") {
      // const resp = JSON.parse(data);
      console.log(`===================base got response==================`);
      console.log(data);
      socketClient.sendtoserver("api_base_response", data);
    }
  });
};
init();
// while (true) {}
