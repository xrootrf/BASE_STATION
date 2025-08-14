const { MessageHandler } = require("../messageHandler");
const {redisClient}=require("../redis")
class Consumer {
  channel;
  replyQueueName;
  rabbit;
  baseRabbit;
  redis;
  constructor(channel, replyQueueName, rabbit, baseRabbit) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.rabbit = rabbit;
    this.baseRabbit = baseRabbit
    this.connectRedis().then(()=>{
      console.log("connected to redis ")
    })
  }

  async connectRedis(){
    this.redis = await redisClient.connect(
      process.env.REDIS_HOST,
      {},
      process.env.REDIS_PORT
    );
  }


  async consumeMessage() {
    
    console.log(`ready to consume messages from ${this.replyQueueName}..!!   `);
    this.channel.consume(
      this.replyQueueName,
      async (message) => {
        const { correlationId, replyTo } = message.properties;
        if (!correlationId || !replyTo) {
          console.log("mission reply data in command.....");
        } else {
          console.log("the corr Id and replyTo are ", correlationId, replyTo);
          const { action, payload, target } = JSON.parse(
            message.content.toString()
          );
          
          await MessageHandler.handle(
            this.redis,
            action,
            payload,
            target,
            correlationId,
            replyTo,
            this.rabbit,
            this.baseRabbit
          );
        }
      },
      { noAck: true }
    );
  }
}

module.exports = { Consumer };
